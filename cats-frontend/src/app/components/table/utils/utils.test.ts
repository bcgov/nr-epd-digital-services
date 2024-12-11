import { get, set } from './index';

describe('get function', () => {
  const obj = {
    a: {
      b: {
        c: 42,
        d: null,
      },
    },
    e: [1, 2, 3],
  };

  it('should return the value for a valid path', () => {
    expect(get(obj, 'a.b.c')).toBe(42);
  });

  it('should return the default value for an invalid path', () => {
    expect(get(obj, 'a.b.x', 'default')).toBe('default');
  });

  it('should return undefined for an invalid path without default value', () => {
    expect(get(obj, 'a.b.x')).toBeUndefined();
  });

  it('should handle array paths', () => {
    expect(get(obj, ['a', 'b', 'c'])).toBe(42);
  });

  it('should handle array indeces', () => {
    expect(get(obj, 'e[1]')).toBe(2);
  });

  it('should return null for a path that leads to null', () => {
    expect(get(obj, 'a.b.d')).toBeNull();
  });

  it('should return undefined when the object to query is nullish without default value', () => {
    expect(get(null, 'a')).toBe(undefined);
  });

  it('should handle should return default value when the object to query is nullish', () => {
    expect(get(null, 'a', 'default')).toBe('default');
  });
});

describe('set', () => {
  it('should set the value at the given path', () => {
    const obj = { a: { b: { c: 42 } } } as any;
    set(obj, 'a.b.c', 100);
    expect(obj.a.b.c).toBe(100);
  });

  it('should create the path if it does not exist', () => {
    const obj = { a: { b: { c: 42 } } } as any;
    set(obj, 'a.b.d', 50);
    expect(obj.a.b.d).toBe(50);
  });

  it('should handle array paths', () => {
    const obj = { a: { b: { c: 42 } } } as any;
    set(obj, ['a', 'b', 'd'], 50);
    expect(obj.a.b.d).toBe(50);
  });

  it('should handle bracket notation in paths', () => {
    const obj = { a: { b: { c: 42 } }, e: [] } as any;
    set(obj, 'e[1]', 2);
    expect(obj.e[1]).toBe(2);
  });

  it('should create intermediate objects if they do not exist', () => {
    const obj = {} as any;
    set(obj, 'a.b.c', 100);
    expect(obj.a.b.c).toBe(100);
  });

  it('should return the modified object', () => {
    const obj = { a: { b: { c: 42 } } } as any;
    const result = set(obj, 'a.b.c', 100);
    expect(result).toBe(obj);
  });

  it('should not modify the object if it is null or undefined', () => {
    expect(set(null, 'a.b.c', 100)).toBeNull();
    expect(set(undefined, 'a.b.c', 100)).toBeUndefined();
  });
});
