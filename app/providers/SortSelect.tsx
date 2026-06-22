'use client'

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
      <select
            className="ml-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  defaultValue={defaultValue}
                        onChange={(e) => {
                                const url = new URL(window.location.href)
                                        url.searchParams.set('sort', e.target.value)
                                                window.location.href = url.toString()
                                                      }}
                                                          >
                                                                <option value="default">Top Rated</option>
                                                                      <option value="price_asc">Price: Low to High</option>
                                                                            <option value="price_desc">Price: High to Low</option>
                                                                                </select>
                                                                                  )
                                                                                  }