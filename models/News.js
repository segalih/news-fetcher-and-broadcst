const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const News = sequelize.define(
  "News",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Cegah duplikasi berita
    },
    isRelevant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    checkedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Aktifkan createdAt dan updatedAt (default)
  }
);

module.exports = News;
