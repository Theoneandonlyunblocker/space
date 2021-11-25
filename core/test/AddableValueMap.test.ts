import { AddableValueMap } from "core/src/generic/AddableValueMap";

class AddableNumberMap<Key> extends AddableValueMap<Key, number, number>
{
  constructor()
  {
    super();
  }

  public get map()
  {
    return this.mapRaw;
  }

  // tslint:disable-next-line: prefer-function-over-method
  protected override getDefaultValue(key: Key): number
  {
    return 0;
  }
  // tslint:disable-next-line: prefer-function-over-method
  protected override squashValues(existing: number, toSquash: number): number
  {
    return existing + toSquash;
  }
}

describe("AddableValueMap", () =>
{
  describe(".add()", () =>
  {
    describe("primitive keys", () =>
    {
      let map: AddableNumberMap<string>;

      beforeEach(() =>
      {
        map = new AddableNumberMap<string>();
      });

      it("merge when key is the same", () =>
      {
        map.add("lol", 69);
        map.add("lol", 420);
        map.add("lmao", 715517);

        expect(map.get("lol")).toBe(69 + 420);
        expect(map.get("lmao")).toBe(715517);
      });
    });

    describe("object keys", () =>
    {
      let map: AddableNumberMap<{x: number; y: number}>;

      beforeEach(() =>
      {
        map = new AddableNumberMap<{x: number; y: number}>();
      });
      it("merge when key is the same object", () =>
      {
        const keyObj = {x: 69, y: 420};
        map.add(keyObj, 6);
        map.add(keyObj, 4);

        expect(map.get(keyObj)).toBe(10);
      });
      it("don't merge when keys are different but equal objects", () =>
      {
        const keyObj = {x: 69, y: 420};
        const clonedKeyObj = {...keyObj};
        map.add(keyObj, 10);
        map.add(clonedKeyObj, 100);
        map.add({x: 69, y: 420}, 1000);

        expect(map.get(keyObj)).toBe(10);
        expect(map.get(clonedKeyObj)).toBe(100);
        expect(map.get({x: 69, y: 420})).toBe(0);
      });
    });
  });
  describe(".get()", () =>
  {
    let map: AddableNumberMap<string>;

    beforeEach(() =>
    {
      map = new AddableNumberMap<string>();
    });

    it("returns key value if present", () =>
    {
      map.add("lol", 69);

      expect(map.get("lol")).toBe(69);
    });
    it("returns default value when key is not present", () =>
    {
      expect(map.get("lol")).toBe(0);
    });
  });
  describe(".filter()", () =>
  {
    let map: AddableNumberMap<string>;

    beforeEach(() =>
    {
      map = new AddableNumberMap<string>();
      map.add("lol", 69);
      map.add("hehe", 789);
    });

    it("returns a clone", () =>
    {
      const filtered = map.filter(() => true);

      expect(map).toEqual(filtered);
      expect(map).not.toBe(filtered);

      expect(filtered.get("lol")).toBe(69);

      filtered.add("lol", 1);
      expect(filtered.get("lol")).toBe(70);
      expect(map.get("lol")).toBe(69);
    });
  });
  describe(".map()", () =>
  {
    let map: AddableNumberMap<string>;

    beforeEach(() =>
    {
      map = new AddableNumberMap<string>();
      map.add("lol", 69);
      map.add("hehe", 789);
    });
    it("can transform keys", () =>
    {
      const numberKeyMap = map.map(stringKey => stringKey.length);

      expect(numberKeyMap.get(3)).toBe(69);
      expect(numberKeyMap.get(4)).toBe(789);
    });
  });
});
