import { Currency } from "./Currency"
import { NativeCurrency } from "./NativeCurrency"
import { WPOL } from "./defaultTokens"
/**
 * POL is the native currency of the Polygon PoS chain
 */
export class POL extends NativeCurrency {
  constructor() {
    super(100, 18, "POL", "POL")
  }

  get wrapped() {
    return WPOL
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
