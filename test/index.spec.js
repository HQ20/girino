const SimpleToken = artifacts.require('SimpleToken');
const chai = require('chai');
const chaiModel = require('../src/index');
const expect = chai.expect;

chai.use(chaiModel);


contract("SimpleToken", accounts => {
    const simpleToken;

    before(async () => {
        simpleToken = await SimpleToken.deployed();
    });

    it("simple", () => {
        var arthur = 'person';
        expect(arthur).to.be.a.model;
    });
});