const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");

require("dotenv").config();

const URL = "https://www.dimensions.com/collection/video-game-consoles";

async function scrapeConsoleNames() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const consoles = [];
    $("div.grid-header-wrapper").each((a, element) => {
      consoles.push($(element).text().trim());
    });

    return consoles;
  } catch (error) {
    console.error("Erro ao realizar o scraping:", error);
    throw error;
  }
}

async function sendEmail(consoleList) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DEST,
      subject: "Lista de Consoles de Videogame - Scraping",
      text: `Os seguintes consoles foram encontrados:\n\n${consoleList.join("\n")}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar o email:", error);
  }
}

async function main() {
  try {
    console.log("Iniciando scraping...");
    const consoleList = await scrapeConsoleNames();

    console.log("Consoles encontrados:");
    console.log(consoleList);

    console.log("Enviando email...");
    await sendEmail(consoleList);
  } catch (error) {
    console.error("Erro no processo:", error);
  }
}

main();
