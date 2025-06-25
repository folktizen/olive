if (process.env.NODE_ENV === "production") {
  for (const method of ["log", "info", "warn", "error", "debug"]) {
    // eslint-disable-next-line no-console
    ;(console as any)[method] = () => {}
  }
}
