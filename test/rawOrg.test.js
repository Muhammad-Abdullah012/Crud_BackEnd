const axios = require("axios");
const { expect } = require("chai");
const { SUCCESS } = require("../DataBase/constants");
const baseUrl = "http://localhost:8000/raw/organizations";

const ORG = {
  name: "github",
  address: "islamabad",
};

const USER = {
  name: "Abc",
  age: 8,
  address: "address",
  profession: "profession",
};

const postOrgReq = async (org) => {
  return await axios
    .post(`${baseUrl}`, {
      name: org.name,
      address: org.address,
    })
    .then((res) => {
      expect(res.status).to.be.equal(200, "Status code does not match");
      return res.data;
    })
    .catch((err) => console.error(err));
};

const deleteReq = async (id) => {
  await axios
    .delete(`${baseUrl}/${id}`)
    .then((res) => {
      expect(res.status).to.be.equal(200, "Status code does not match");
      expect(res.data).to.be.equal(SUCCESS);
    })
    .catch((err) => console.error(err));
};

const putReq = async (data) => {
  return await axios
    .put(`${baseUrl}`, data)
    .then((res) => {
      expect(res.status).to.be.equal(200);
      return res.data;
    })
    .catch((err) => console.error(err));
};

const getAllReq = async () => {
  return await axios
    .get(`${baseUrl}`)
    .then((res) => {
      expect(res.status).to.be.eq(200);
      return res.data;
    })
    .catch((err) => console.error(err));
};

const deleteAll = async (arr) => {
  for (let i = 0; i < arr.length; ++i) {
    await deleteReq(arr[i].id);
  }
};

describe("GET /organizations", function () {
  let orgs;
  it("Should be empty", async function () {
    orgs = await getAllReq();
    expect(orgs.length).to.be.equal(0);
  });
  it("Should return organizations", async function () {
    await postOrgReq(ORG);
    await postOrgReq(ORG);
    orgs = await getAllReq();
    expect(orgs.length).to.be.equal(2);
  });
  afterEach(async function () {
    await deleteAll(orgs);
  });
});

describe("POST /organization", function () {
  let org;
  beforeEach(async function () {
    org = await postOrgReq(ORG);
  });
  it("Should add organization", async function () {
    expect(org.name).to.be.equal(ORG.name, "Name does not match");
    expect(org.address).to.be.equal(ORG.address, "Address does not match");
  });
  afterEach(async function () {
    await deleteReq(org.id);
  });
});

describe("PUT /organization", function () {
  let org;
  beforeEach(async function () {
    org = await postOrgReq(ORG);
  });
  it("Should update organization", async function () {
    const address = "Rwp, Pakistan";
    const updatedOrg = await putReq({ id: org.id, address });
    expect(updatedOrg.address).to.be.equal(address);
  });
  afterEach(async function () {
    await deleteReq(org.id);
  });
});

describe("DELETE /organization", function () {
  let org;
  beforeEach(async function () {
    org = await postOrgReq(ORG);
  });
  it("Should delete organization", async function () {
    await deleteReq(org.id);
  });
});
