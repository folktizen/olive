import { Currency } from "./Currency"
import { NativeCurrency } from "./NativeCurrency"
import { WAVAX } from "./defaultTokens"
/**
 * AVAX is the native currency of the Avalanche chain
 */
export class AVAX extends NativeCurrency {
  constructor() {
    super(43114, 18, "AVAX", "AVAX")
  }

  get wrapped() {
    return WAVAX
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return (
      other.isNative &&
      this.chainId === other.chainId &&
      this.address === other.address
    )
  }
}
