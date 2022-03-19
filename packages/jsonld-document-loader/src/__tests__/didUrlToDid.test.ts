import { didUrlToDid } from "..";

it("can conver a did key url", () => {
  expect(
    didUrlToDid(
      "did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc#zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc"
    )
  ).toBe("did:key:zDnaeTMKBwx2iJpata1vSSwfpjjg1npfeYAEwMArBKbDC7iUc");
});
