const app = require("../server");
const supertest = require("supertest");
const req = supertest(app);

describe("Sales endpoint", () => {
  describe("/record route", () => {
    let record_res;
    // let record_validation_res;
    let file = `${__dirname}/to_be_uploaded.csv`;
    // let file_validation = `${__dirname}/to_be_uploaded_validation.csv`;

    beforeAll(async () => {
      record_res = await req
        .post("/sales/record")
        .attach("uploaded_file", file);

      // record_validation_res = await req
      //   .post("/sales/record")
      //   .attach("uploaded_file", file_validation);
    });

    it("should successfully save csv file data without errors", async (done) => {
      record_res = await req
        .post("/sales/record")
        .attach("uploaded_file", file);
      // .expect((res) => {
      //   const result = JSON.parse(res.text);
      //   expect(result.body.message).toBe("successfully loaded data");
      //   done();
      // });

      const res = JSON.parse(record_res.text);
      expect(res.body.message).toBe("successfully loaded data");
      done();
    }, 3000);

    // it("should not successfully save csv return validation error", async (done) => {
    //   // const res = JSON.parse(record_validation_res.text);
    //   // expect(res.body.message).toBe(
    //   //   "CSV file has validation errors. Please correct and re upload again"
    //   // );
    //   // // expect(res.body.message).toBe("CSV file has validation errors. Please correct and re upload again");
    //   // done();

    //   record_validation_res = await req
    //     .post("/sales/record")
    //     .attach("uploaded_file", file_validation);

    //   const result = JSON.parse(record_validation_res.text);
    //   expect(res.body.message).toBe(
    //     "CSV file has validation errors. Please correct and re upload again"
    //   );
    //   done();
    // }, 30000);
  });

  describe("/report with validation", () => {
    let record_validation_res;
    let file_validation = `${__dirname}/to_be_uploaded_validation.csv`;

    // beforeAll(async () => {
    //   record_validation_res = await req
    //     .post("/sales/record")
    //     .attach("uploaded_file", file_validation);
    // });

    it("should not successfully save csv return validation error", async (done) => {
      // const res = JSON.parse(record_validation_res.text);
      // expect(res.body.message).toBe(
      //   "CSV file has validation errors. Please correct and re upload again"
      // );
      // // expect(res.body.message).toBe("CSV file has validation errors. Please correct and re upload again");
      // done();

      record_validation_res = await req
        .post("/sales/record")
        .attach("uploaded_file", file_validation)
        .expect((res) => {
          const result = JSON.parse(res.text);
          expect(res.body.message).toBe(
            "CSV file has validation errors. Please correct and re upload again"
          );
          done();
        });

      // const res = JSON.parse(record_validation_res.text);
      // expect(res.body.message).toBe(
      //   "CSV file has validation errors. Please correct and re upload again"
      // );

      // done();
    }, 30000);
  });
  describe("/report rooute", () => {
    it("should load the report", () => {
      // const res = await req.get("/sales/report");
      expect(res.body.message).toBe("report!");
    });
  });
});
