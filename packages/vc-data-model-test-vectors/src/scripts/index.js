const case0 = require("./case-0");
const case0Check = require("./case-0.check");

const case1 = require("./case-1");
const case1Check = require("./case-1.check");

const case2 = require("./case-2");
const case2Check = require("./case-2.check");

const case3 = require("./case-3");
const case3Check = require("./case-3.check");

(async () => {
  console.log("Generating test vectors...");
  await case0();
  await case0Check();

  await case1();
  await case1Check();

  await case2();
  await case2Check();

  await case3();
  await case3Check();
})();
