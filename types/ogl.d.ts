declare module "ogl" {
  export class Renderer {
    constructor(opts?: any);
    gl: any;
    dpr: number;
    setSize(width: number, height: number): void;
    render(opts?: any): void;
  }

  export class Program {
    constructor(gl: any, opts?: any);
  }

  export class Triangle {
    constructor(gl: any);
  }

  export class Mesh {
    constructor(gl: any, opts?: any);
  }

  const _default: any;
  export default _default;
}
