const app = require("../server");
const supertest = require("supertest");
const req = supertest(app);

describe("Sales endpoint", () => {
  describe("/record route", () => {
    let record_res, record_validation_res;
    let file = `${__dirname}/to_be_uploaded.csv`;
    let file_validation = `${__dirname}/to_be_uploaded_validation.csv`;

    it("should successfully save csv file data without errors", async () => {
      record_res = await req
        .post("/sales/record")
        .attach("uploaded_file", file);

      const res = JSON.parse(record_res.text);
      expect(res.body.message).toBe("successfully loaded data");
    });
    it("should not successfully save csv return validation error", async () => {
      record_validation_res = await req
        .post("/sales/record")
        .attach("uploaded_file", file_validation);

      const res = JSON.parse(record_validation_res.text);
      expect(res.body.message).toBe(
        "CSV file has validation errors. Please correct and re upload again"
      );
      expect(res.body.validation_errors[0].validation_errors.length > 0).toBe(
        true
      );
    });
  });
  describe("/report route", () => {
    it("should load the report", () => {
      // const report_request = await req.get("/sales/report");
      // console.log("loading report");
      // // console.log(report_request.text);
      // // const res = JSON.parse(report_request.text);
      // expect(JSON.parse(report_request.text).body.message).toBe("report!");
    });
  });
});
