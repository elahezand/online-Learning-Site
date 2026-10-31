const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const env = require("../config/env");
const { UPLOAD_DIR, VIDEO_DIR } = require("../utils/files");
const { hashPassword } = require("../utils/tokens");
const data = require("./seed-data");

const MODELS_DIR = path.join(__dirname, "..", "models");
const DAY_MS = 24 * 60 * 60 * 1000;

let seed = 20261030;
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = (list) => list[Math.floor(random() * list.length)];
const between = (min, max) => Math.floor(random() * (max - min + 1)) + min;
const sample = (list, count) => [...list].sort(() => random() - 0.5).slice(0, count);
const daysAgo = (days) => new Date(Date.now() - days * DAY_MS - between(0, DAY_MS));
const priceAfter = (price, percent = 0) => Math.round((price * (100 - percent)) / 100);

const loadModels = () => {
  const models = {};
  for (const file of fs.readdirSync(MODELS_DIR)) {
    if (file === "fields.js") continue;
    const model = require(path.join(MODELS_DIR, file));
    models[model.modelName] = model;
  }
  return models;
};

const COVERS_DIR = path.join(__dirname, "seed-assets", "covers");

const copyCover = (fileName) => {
  const source = path.join(COVERS_DIR, fileName);
  if (!fs.existsSync(source)) {
    console.warn(`Cover not found: ${fileName}`);
    return undefined;
  }
  fs.copyFileSync(source, path.join(UPLOAD_DIR, fileName));
  return fileName;
};

const sessionTime = () => `${between(6, 38)}:${String(between(0, 59)).padStart(2, "0")}`;

const run = async () => {
  if (!process.argv.includes("--fresh")) {
    console.log("This deletes ALL data in the database and fills it with sample data.");
    console.log("Run it again with --fresh to continue:  npm run seed -- --fresh");
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);
  const M = loadModels();

  await mongoose.connection.dropDatabase();
  await Promise.all(Object.values(M).map((model) => model.syncIndexes()));

  const videos = fs.readdirSync(VIDEO_DIR).filter((file) => /\.(mp4|webm|mkv|mov)$/i.test(file));
  if (!videos.length) console.warn("No videos found in storage/videos — sessions will have no video.");

  const studentPassword = await hashPassword("Student1234");
  const [admin, demo] = await M.User.create([
    { name: "Elahe Zand", username: "admin", email: "admin@academia.test", phone: "09120000001", password: await hashPassword("Admin1234"), role: "ADMIN" },
    { name: "Demo Student", username: "student", email: "student@academia.test", phone: "09120000002", password: studentPassword, wallet: { balance: 300000 } },
  ]);

  const usedUsernames = new Set();
  const students = await M.User.insertMany(
    Array.from({ length: 30 }, (_, index) => {
      const first = data.FIRST_NAMES[index % data.FIRST_NAMES.length];
      const last = pick(data.LAST_NAMES);
      let username = `${first}.${last}`.toLowerCase();
      while (usedUsernames.has(username)) username += between(1, 9);
      usedUsernames.add(username);
      return {
        name: `${first} ${last}`,
        username,
        email: `${username}@example.com`,
        phone: `0912${String(1000000 + index * 7919).slice(-7)}`,
        password: studentPassword,
        wallet: { balance: random() < 0.2 ? between(1, 5) * 100000 : 0 },
        createdAt: daysAgo(between(1, 180)),
      };
    })
  );

  const categories = {};
  for (const category of data.CATEGORIES) {
    categories[category.name] = { ...category, doc: await M.Category.create({ name: category.name, title: category.title }) };
  }

  const courses = [];
  for (const [index, course] of data.COURSES.entries()) {
    const category = categories[course.category];
    const doc = await M.Course.create({
      name: course.name,
      shortName: course.shortName,
      description: course.description,
      price: course.price,
      discount: course.discount,
      isComplete: course.isComplete,
      status: course.status || "start",
      support: "Telegram group",
      cover: copyCover(`${course.shortName}.jpg`),
      categoryID: category.doc._id,
      creator: admin._id,
      createdAt: daysAgo(200 - index * 12),
    });

    await M.Session.insertMany(
      course.sessions.map((title, position) => ({
        title,
        time: sessionTime(),
        free: course.price === 0 || position === 0 ? 1 : 0,
        video: videos.length ? videos[(index + position) % videos.length] : undefined,
        course: doc._id,
      }))
    );
    courses.push(doc);
  }
  const courseBy = Object.fromEntries(courses.map((course) => [course.shortName, course]));

  for (const category of data.CATEGORIES) {
    const parent = await M.Menu.create({ title: category.title, href: category.name });
    const inCategory = data.COURSES.filter((course) => course.category === category.name).slice(0, 6);
    await M.Menu.insertMany(inCategory.map((course) => ({ title: course.name, href: course.shortName, parent: parent._id })));
  }

  await M.Off.insertMany(
    data.OFFS.map((off) => ({ ...off, course: courseBy[off.course]._id, creator: admin._id }))
  );

  const toItem = (course) => ({
    course: course._id,
    price: course.price,
    discount: course.discount,
    finalPrice: priceAfter(course.price, course.discount),
    snapshot: { name: course.name, shortName: course.shortName, cover: course.cover },
  });

  const enrolled = new Map();
  const buy = async (user, bought, { days, status = "paid", walletUsed = 0 } = {}) => {
    const items = bought.map(toItem);
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const amount = items.reduce((sum, item) => sum + item.finalPrice, 0);
    const createdAt = daysAgo(days ?? between(1, 120));
    const paid = status === "paid";
    const wallet = Math.min(walletUsed, amount);
    const online = amount - wallet;

    await M.Order.create({
      user: user._id,
      items,
      pricing: { subtotal, discount: subtotal - amount, walletUsed: wallet, total: online },
      status: paid ? "processing" : status === "failed" ? "cancelled" : "created",
      paymentMethod: online > 0 ? "zarinpal" : wallet > 0 ? "wallet" : "free",
      paymentStatus: status,
      payment: {
        authority: online > 0 ? `A${String(between(1e9, 9e9))}` : null,
        refId: paid && online > 0 ? String(between(1e7, 9e7)) : null,
        paidAt: paid ? createdAt : null,
      },
      couponCounted: false,
      walletRefunded: status === "failed",
      finalizedAt: paid ? createdAt : null,
      revertedAt: status === "failed" ? createdAt : null,
      createdAt,
      updatedAt: createdAt,
    });

    if (!paid) return;
    await M.CourseUser.insertMany(
      items.map((item) => ({ user: user._id, course: item.course, price: item.finalPrice, createdAt }))
    );
    for (const item of items) {
      const key = String(item.course);
      enrolled.set(key, [...(enrolled.get(key) || []), user]);
    }
  };

  for (const student of students) {
    const bought = sample(courses, between(1, 4));
    await buy(student, bought);
  }
  await buy(students[0], [courseBy["docker-for-developers"]], { status: "pending", days: 0 });
  await buy(students[1], [courseBy["figma-ui-basics"]], { status: "failed", days: 3 });

  await buy(demo, [courseBy["react-in-practice"]], { days: 20, walletUsed: 200000 });
  await buy(demo, [courseBy["python-beginners"]], { days: 35 });
  await buy(demo, [courseBy["node-express-api"]], { status: "failed", days: 5 });

  const comments = [];
  for (const course of courses) {
    const buyers = enrolled.get(String(course._id)) || [];
    for (const creator of sample(buyers, Math.min(buyers.length, between(2, 5)))) {
      const template = pick(data.COMMENTS);
      comments.push({
        body: template.body,
        score: template.score,
        course: course._id,
        creator: creator._id,
        answer: random() < 0.8 ? 1 : 0,
        isAnswer: 0,
        createdAt: daysAgo(between(1, 60)),
      });
    }
  }
  const savedComments = await M.Comment.insertMany(comments);
  await M.Comment.insertMany(
    savedComments
      .filter((comment) => comment.answer === 1 && random() < 0.4)
      .map((comment) => ({
        body: pick(data.ANSWERS),
        score: 5,
        course: comment.course,
        creator: admin._id,
        answer: 1,
        isAnswer: 1,
        mainCommendID: comment._id,
        createdAt: new Date(comment.createdAt.getTime() + DAY_MS / 2),
      }))
  );

  await M.Article.insertMany(
    data.ARTICLES.map((article, index) => {
      const category = categories[article.category];
      return {
        title: article.title,
        shortName: article.shortName,
        description: article.description,
        body: article.body,
        cover: copyCover(`article-${article.shortName}.jpg`),
        categoryID: category.doc._id,
        creator: admin._id,
        publish: 1,
        createdAt: daysAgo(90 - index * 14),
      };
    })
  );

  const departments = [];
  for (const department of data.DEPARTMENTS) {
    const doc = await M.Department.create({ title: department.title });
    const subs = await M.DepartmentSub.insertMany(department.subs.map((title) => ({ title, parent: doc._id })));
    departments.push({ doc, subs });
  }

  for (const [index, ticket] of data.TICKETS.entries()) {
    const { doc, subs } = departments[ticket.dept];
    const createdAt = daysAgo(10 - index * 3);
    const main = await M.Ticket.create({
      departmentID: doc._id,
      departmentSubID: subs[ticket.sub]._id,
      priority: ticket.priority,
      title: ticket.title,
      body: ticket.body,
      user: demo._id,
      course: courseBy["react-in-practice"]._id,
      answer: ticket.answer ? 1 : 0,
      isAnswer: 0,
      createdAt,
    });
    if (!ticket.answer) continue;
    await M.Ticket.create({
      departmentID: doc._id,
      departmentSubID: subs[ticket.sub]._id,
      priority: ticket.priority,
      title: ticket.title,
      body: ticket.answer,
      user: admin._id,
      answer: 1,
      isAnswer: 1,
      parent: main._id,
      createdAt: new Date(createdAt.getTime() + DAY_MS / 3),
    });
  }

  await M.Contact.insertMany(data.CONTACTS.map((contact, index) => ({ answer: 0, ...contact, createdAt: daysAgo(index * 4 + 1) })));
  await M.NewsLetter.insertMany(sample(students, 10).map((student) => ({ email: student.email })));
  await M.Info.create({ phone: "02112345678", email: "hello@academia.test" });

  await M.Notification.insertMany([
    { user: demo._id, msg: "Welcome to ACADEMIA! Start with the free Python course.", link: "/course-info/python-beginners" },
    { user: demo._id, type: "order_status", msg: "Your payment for React 19 in Practice was successful.", link: "/my-account/orders" },
    { user: admin._id, msg: "3 new comments are waiting for review.", link: "/p-admin/comments?status=pending" },
  ]);

  const counts = await Promise.all(
    ["User", "Course", "Session", "CourseUser", "Order", "Comment", "Article", "Ticket"].map(async (name) => `${name}: ${await M[name].countDocuments()}`)
  );

  console.log("\nSample data is ready.\n");
  console.log(counts.join("  |  "));
  console.log("\nAdmin:    admin@academia.test   /  Admin1234");
  console.log("Student:  student@academia.test /  Student1234");
  console.log("Other students use the password Student1234\n");

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Seeding failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
