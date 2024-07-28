class BackendException<Code extends string = string> extends Error {
  constructor(
    public message: string,
    public code?: Code,
    public statusCode?: number,
    public context?: any,
  ) {
    super(JSON.stringify({ message, code, statusCode }));

    if (!this.code) this.createCodeFromMessage();
  }

  override toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context || {},
    };
  }

  createCodeFromMessage() {
    this.code = (this.message?.replace(/\s/g, '_').toUpperCase() ?? 'UNKNOWN') as Code;
  }
}

export default BackendException;
