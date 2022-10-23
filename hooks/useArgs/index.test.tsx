import { faker } from "@faker-js/faker";
import { BigNumber } from "ethers";
import { times } from "lodash";
import { act, renderHook } from "testing";
import {
  buildAbiDefinedFunction,
  buildAddress,
  buildInput,
  buildInputList,
} from "testing/factory";
import { useArgs } from ".";

describe("useArgs", () => {
  it("should return values", () => {
    const func = buildAbiDefinedFunction({ inputs: [] });
    const { result } = renderHook(() => useArgs(func));

    expect(result.current.values).toEqual([]);
  });

  it("should initialize each input with an empty string", () => {
    const inputs = buildInputList(2);
    const func = buildAbiDefinedFunction({ inputs });
    const { result } = renderHook(() => useArgs(func));

    expect(result.current.values).toEqual(["", ""]);
  });

  it("should update the speficied arg", () => {
    const value = "foo";
    const input1 = buildInput({ type: "string" });
    const input2 = buildInput({ type: "string" });
    const func = buildAbiDefinedFunction({ inputs: [input1, input2] });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateValue(1, value);
    });

    expect(result.current.values).toEqual(["", value]);
  });

  it("should return formatted big number args", () => {
    const value = "1";
    const input = buildInput({ type: "uint256" });
    const func = buildAbiDefinedFunction({ inputs: [input] });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateValue(0, value);
    });

    expect(result.current.args).toEqual([BigNumber.from(value)]);
  });

  it("should return provided value when big number conversion throws", () => {
    const value = faker.random.word();
    const input = buildInput({ type: "uint256" });
    const func = buildAbiDefinedFunction({ inputs: [input] });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateValue(0, value);
    });

    expect(result.current.args).toEqual([value]);
  });

  it("should return formatted args for string array", () => {
    const value = "foo, bar, baz";
    const input = buildInput({ type: "string[]" });
    const func = buildAbiDefinedFunction({ inputs: [input] });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateValue(0, value);
    });

    expect(result.current.args).toEqual([["foo", "bar", "baz"]]);
  });

  it("should return formatted args for address array", () => {
    const addresses = times(3, () => buildAddress());
    const value = addresses.join(", ");
    const input = buildInput({ type: "address[]" });
    const func = buildAbiDefinedFunction({ inputs: [input] });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateValue(0, value);
    });

    expect(result.current.args).toEqual([addresses]);
  });

  it("should return formatted args for uint256[]", () => {
    const values = "1, 2, 3";
    const input = buildInput({ type: "uint256[]" });
    const func = buildAbiDefinedFunction({ inputs: [input] });
    const { result } = renderHook(() => useArgs(func));

    act(() => {
      result.current.updateValue(0, values);
    });

    expect(result.current.args).toEqual([
      [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
    ]);
  });
});
