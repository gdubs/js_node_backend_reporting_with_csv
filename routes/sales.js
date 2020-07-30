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

router.post("/record", upload.single("uploaded_file"), async (req, res) => {
  let json_data = await get_json_from_csv_file(`./${req.file.path}`);

  fs.unlinkSync(`./${req.file.path}`);

  if (json_data.validation_errors.length > 0) {
    response_body.body.message =
      "CSV file has validation errors. Please correct and re upload again";
    response_body.body.validation_errors = json_data.validation_errors;
  } else {
    fs.writeFileSync(
      "./saved_files/saved_data.json",
      JSON.stringify(json_data.sales)
    );
    response_body.body.message = "successfully loaded data";
  }

  res.send(JSON.stringify(response_body));
});

router.get("/report", (req, res) => {
  const saved_data = get_data_from_json_file("/saved_files/saved_data.json");
  const body = {
    message: "report!",
    data: saved_data,
  };

  res.send(JSON.stringify({ body }));
});

const get_data_from_json_file = (file) => {
  let output = [];
  console.log("get_json_from file");
  fs.readFile(file, (err, data) => {
    if (err) throw err;
    output = JSON.parse(data);
  });

  return output;
};
const get_json_from_csv_file = (file) => {
  let output = { sales: [], validation_errors: [] };
  let stream = fs.createReadStream(file);

  return new Promise((resolve, reject) => {
    let csv_row_num = 0;

    let csvStream = csv
      .parse({ headers: true })
      .on("data", async (row) => {
        csv_row_num += 1;
        const validated_row = validate_row({ ...row, csv_row_num });

        if (validated_row.validation_errors.length > 0)
          output.validation_errors.push(validated_row);

        output.sales.push(row);
      })
      .on("error", reject)
      .on("end", () => resolve(output));

    stream.pipe(csvStream);
  });
};

const validate_row = (csv_row) => {
  let validation_errors = [];
  const { csv_row_num } = csv_row;

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
