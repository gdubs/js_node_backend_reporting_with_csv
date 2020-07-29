const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const interval_upload = 5000;
const interval_report = interval_upload + 1500;
let has_uploaded = false;

const headers = {
  "Content-type": "multipart/form-data",
};

setInterval(async () => {
  console.log("uploading");
  let file = fs.readFileSync(`${__dirname}/upload_hourly.csv`, "utf-8");
  let form_data = new FormData();
  form_data.append("uploaded_file", file, { type: "text/csv" });
  console.log(form_data);

  await axios
    .post("http://localhost:3030/sales/record", form_data, {})
    .then((res) => {
      console.log("then");
      //   console.log(res.data);
      has_uploaded = true;
    });

  has_uploaded = true;
  //   if (has_uploaded)
  //     setTimeout(() => {
  //       console.log("requesting report");
  //       axios.get("http://localhost:3030/sales/report").then((res) => {
  //         console.log(res.data);
  //         has_uploaded = false;
  //       });
  //     }, interval_report);
}, interval_upload);
