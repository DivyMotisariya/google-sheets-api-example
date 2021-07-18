const express = require("express"),
  fs = require("fs"),
  readline = require("readline"),
  { google } = require("googleapis"),
  request = require("request"),
  app = express();

app.use(express.static(__dirname + "/public"));
app.set("views", "views");
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("test");
});

app.post("/", async(req, res) => {
  const { author, article } = req.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "test.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  const spreadsheetId = "1gi_4pWVgFSCVLkCtDeR6MOm-LIX_WEsyq_987yptChk";

  await googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [article, author]
      ],
    },
  });

  const readData = await googleSheetsInstance.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
  });
  console.log(readData);

  res.send(readData.data);
});

app.listen(3000);