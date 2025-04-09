const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); 

chai.use(chaiHttp);
const expect = chai.expect;

describe("Users", () => {
  // Get all users
  it("should GET all users", (done) => {
    chai
      .request("http://localhost:5001") 
      .get("/users")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // Add a new user
  it("should POST a new user", (done) => {
    const newUser = {
      name: "Aya",
      email: "aya@example.com"
    };
  
    chai
      .request("http://localhost:5001")
      .post("/users")
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("name", "Aya");
        expect(res.body).to.have.property("email", "aya@example.com");
        done();
      });
  });  
  
});