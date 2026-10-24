const path = require("path");
const express = require("express");
const cors = require("./middlewares/cors");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const articleRoutes = require("./routes/v1/article");
const authRoutes = require("./routes/v1/auth");
const categoryRoutes = require("./routes/v1/category");
const commentRoutes = require("./routes/v1/comment");
const contactRoutes = require("./routes/v1/contact");
const courseRoutes = require("./routes/v1/course");
const infoRoutes = require("./routes/v1/infos");
const menuRoutes = require("./routes/v1/menu");
const newsletterRoutes = require("./routes/v1/newsletter");
const notificationRoutes = require("./routes/v1/notification");
const discountRoutes = require("./routes/v1/off");
const orderRoutes = require("./routes/v1/order");
const searchRoutes = require("./routes/v1/search");
const ticketRoutes = require("./routes/v1/ticket");
const userRoutes = require("./routes/v1/user");

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cors);
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1/articles", articleRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/category", categoryRoutes);
app.use("/v1/comments", commentRoutes);
app.use("/v1/contact", contactRoutes);
app.use("/v1/courses", courseRoutes);
app.use("/v1/infos", infoRoutes);
app.use("/v1/menus", menuRoutes);
app.use("/v1/newsletters", newsletterRoutes);
app.use("/v1/notifications", notificationRoutes);
app.use("/v1/offs", discountRoutes);
app.use("/v1/orders", orderRoutes);
app.use("/v1/search", searchRoutes);
app.use("/v1/tickets", ticketRoutes);
app.use("/v1/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
