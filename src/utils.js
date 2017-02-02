export const initialPreset = () => (
  new Array(
    10 * 10
  ).fill(
    undefined
  ).map(
    (_, index) => [
      10 + Math.floor(index % 10), 
      10 + Math.floor(index / 10),
      0,
      '#fff'
    ]
  )
)
