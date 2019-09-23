import * as PIXI from "pixi.js";


export class SvgCache<Sources extends {[key: string]: string}>
{
  private readonly sources: Sources;
  private readonly cached: Record<keyof Sources, SVGElement> = <any>{};

  constructor(sources: Sources)
  {
    this.sources = sources;
  }

  public get(key: keyof Sources): SVGElement
  {
    const rawElement = this.cached[key];
    const clone = <SVGElement> rawElement.cloneNode(true);

    return clone;
  }
  public load(baseUrl: string): Promise<void>
  {
    const loader = new PIXI.Loader(baseUrl);

    for (const key in this.sources)
    {
      loader.add(
      {
        url: this.sources[key],
        loadType: 1, // XML
      });
    }

    return new Promise(resolve =>
    {
      loader.load(() =>
      {
        for (const key in this.sources)
        {
          const response = <XMLDocument> loader.resources[this.sources[key]].data;
          const svgDoc = <SVGElement> response.children[0];
          this.cached[key] = svgDoc;
        }

        resolve();
      });
    });
  }
}
