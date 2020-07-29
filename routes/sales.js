const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploaded_files/" });
const csv = require("fast-csv");

router.get("/", (req, res) => {
  res.send("yo dude sales");
});

let response_body = {
  body: {
    message: "",
  },
};

router.post("/record", upload.single("uploaded_file"), (req, res) => {
  // console.log("file is");
  console.log(req.file);
  let json_data = get_json_from_file(`./${req.file.path}`);

  fs.unlinkSync(`./${req.file.path}`);
  // const csv_data = req.file.buffer.toString("utf8");

  if (json_data.validation_errors.length > 0) {
    response_body.body.message =
      "CSV file has validation errors. Please correct and re upload again";
    response_body.body.validation_errors = json_data.validation_errors;
  } else {
    response_body.body.message = "successfully loaded data";
  }

  // console.log("sending response");
  // console.log(response_body);
  res.send(JSON.stringify(response_body));
});

router.get("/report", (req, res) => {
  res.send("report!");
});

const get_json_from_file = (file) => {
  let output = { sales: [], validation_errors: [] };
  let stream = fs.createReadStream(file);
  let csv_row_num = 0;

  let csvStream = csv.parse({ headers: true }).on("data", async (row) => {
    csv_row_num += 1;
    const validated_row = validate_row({ ...row, csv_row_num });

    if (validated_row.validation_errors.length > 0)
      output.validation_errors.push(validated_row);

    output.sales.push(row);
  });
  // .on("end", (count) => console.log(`total ${count} rows`));

  stream.pipe(csvStream);

  return output;
};

const validate_row = (csv_row) => {
  let validation_errors = [];
  const { csv_row_num } = csv_row;

  console.log("validate row");
  // console.log(csv_row);

  if (!csv_row["USER_NAME"]) {
    validation_errors.push("Invalid user name");
  }

  if (!csv_row["AGE"] || isNaN(csv_row["AGE"])) {
    validation_errors.push("Invalid age");
  }

  if (!csv_row["HEIGHT"] || isNaN(csv_row["HEIGHT"])) {
    validation_errors.push("Invalid height");
  }

  if (
    !csv_row["GENDER"] ||
    ["M", "F", "m", "f"].indexOf(csv_row["GENDER"]) === -1
  ) {
    validation_errors.push("Invalid gender");
  }

  if (!csv_row["SALE_AMOUNT"] || isNaN(csv_row["SALE_AMOUNT"])) {
    validation_errors.push("Invalid sale amount");
  }

  if (
    !csv_row["LAST_PURCHASE_DATE"] ||
    (new Date(csv_row["LAST_PURCHASE_DATE"]) === "Invalid Date" &&
      isNaN(new Date(csv_row["LAST_PURCHASE_DATE"])))
  ) {
    validation_errors.push("Invalid date");
  }
  return { csv_row_num, validation_errors };
};

module.exports = router;
