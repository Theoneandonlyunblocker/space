import Star from "./Star";


interface regionWithStars
{
  region: Region;
  stars: Star[];
}

export default class Region
{
  id: string;
  stars: Star[] = [];
  starsById:
  {
    [starId: number]: Star;
  } = {};

  constructor(id: string, initialStars?: Star[])
  {
    this.id = id;

    if (initialStars)
    {
      initialStars.forEach(star => this.addStar(star));
    }
  }
  public addStar(star: Star): void
  {
    this.stars.push(star);
    this.starsById[star.id] = star;
  }
  public hasStar(star: Star): boolean
  {
    return Boolean(this.starsById[star.id]);
  }
  public severLinksToRegionsExcept(exemptRegions: Region[]): void
  {
    this.severLinksForQualifier((a, b) =>
    {
      const isPartOfExemptRegion = exemptRegions.some(region =>
      {
        return region.hasStar(b);
      });

      return !isPartOfExemptRegion;
    });
  }
  public getBorderLengthWithStars(stars: Star[]): number
  {
    const sharedHalfEdges = this.getSharedHalfEdgesWithStars(stars);
    const borderLength = sharedHalfEdges.reduce((borderLength, halfEdge) =>
    {
      const edge = halfEdge.edge;
      const edgeLength = Math.abs(edge.va.x - edge.vb.x) + Math.abs(edge.va.y - edge.vb.y);

      return edgeLength;
    }, 0);

    return borderLength;
  }
  public getStarsByDistanceToQualifier(qualifierFN: (star: Star) => boolean): {[distance: number]: Star[]}
  {
    const starsByDistance:
    {
      [distance: number]: Star[];
    } = {};

    this.stars.forEach(star =>
    {
      const nearestStar = star.getNearestStarForQualifier(qualifierFN);
      const distanceToNearestStar = star.getDistanceToStar(nearestStar);

      if (!starsByDistance[distanceToNearestStar])
      {
        starsByDistance[distanceToNearestStar] = [];
      }

      starsByDistance[distanceToNearestStar].push(star);
    });

    return starsByDistance;
  }
  public getLinkedStars(): Star[]
  {
    return this.getUniqueStarsFromCallback(star =>
    {
      const linkedStars = star.getLinkedInRange(1).all;

      return linkedStars.filter(linkedStar =>
      {
        return !this.hasStar(linkedStar);
      });
    });
  }
  public getMajorityRegions(regionsToCheck: Region[]): Region[]
  {
    const overlappingStarsWithRegions = this.getOverlappingStarsWithRegions(regionsToCheck);

    let maxStarCount = 0;
    const regionsByOverlappingStarCount:
    {
      [overlappingStarCount: number]: Region[];
    } = {};

    overlappingStarsWithRegions.forEach(regionWithStars =>
    {
      const starCount = regionWithStars.stars.length;
      if (!regionsByOverlappingStarCount[starCount])
      {
        regionsByOverlappingStarCount[starCount] = [];
      }

      regionsByOverlappingStarCount[starCount].push(regionWithStars.region);
      maxStarCount = Math.max(maxStarCount, starCount);
    });

    return regionsByOverlappingStarCount[maxStarCount];
  }
  public getLinkedRegions(regionsToCheck: Region[]): Region[]
  {
    return this.getLinkedStarsWithRegions(regionsToCheck).map(rs =>
    {
      return rs.region;
    });
  }

  private getSharedHalfEdgesWithStars(stars: Star[]): Voronoi.HalfEdge<Star>[]
  {
    const toCheckRegion = new Region(null, stars);
    const sharedStarsWithRegion = this.getNeighboringStarsWithRegions([toCheckRegion])[0];
    const neighboringStars = sharedStarsWithRegion ? sharedStarsWithRegion.stars : [];

    const sharedHalfEdges: Voronoi.HalfEdge<Star>[] = [];

    neighboringStars.forEach(star =>
    {
      star.voronoiCell.halfedges.forEach((halfEdge: Voronoi.HalfEdge<Star>) =>
      {
        const edge = halfEdge.edge;
        const edgeNeighborsThisRegion =
        (
          (edge.lSite && this.hasStar(edge.lSite)) ||
          (edge.rSite && this.hasStar(edge.rSite))
        );

        if (edgeNeighborsThisRegion)
        {
          sharedHalfEdges.push(halfEdge);
        }
      });
    });

    return sharedHalfEdges;
  }
  private getLinkedStarsWithRegions(regionsToCheck: Region[]): regionWithStars[]
  {
    return Region.getRegionsWithStarsForQualifier(
      regionsToCheck,
      this.getLinkedStars(),
      (region: Region, star: Star) => region.hasStar(star),
    );
  }
  private getOverlappingStarsWithRegions(regionsToCheck: Region[]): regionWithStars[]
  {
    return Region.getRegionsWithStarsForQualifier(
      regionsToCheck,
      this.stars,
      (region: Region, star: Star) => region.hasStar(star),
    );
  }
  private getNeighboringStarsWithRegions(regionsToCheck: Region[]): regionWithStars[]
  {
    return Region.getRegionsWithStarsForQualifier(
      regionsToCheck,
      this.getNeighboringStars(),
      (region: Region, star: Star) => region.hasStar(star),
    );
  }

  private static getRegionsWithStarsForQualifier(
    regionsToCheck: Region[],
    starsToCheck: Star[],
    qualifierFN: (region: Region, star: Star) => boolean,
  ): regionWithStars[]
  {
    const regionsWithStarsForQualifier: regionWithStars[] = regionsToCheck.map(region =>
    {
      const starsThatPassQualifier = starsToCheck.filter(star =>
      {
        return qualifierFN(region, star);
      });

      return(
      {
        region: region,
        stars: starsThatPassQualifier,
      });
    });

    return regionsWithStarsForQualifier.filter(regionWithStars =>
    {
      return regionWithStars.stars.length > 0;
    });
  }
  private severLinksForQualifier(qualifierFN: (a: Star, b: Star) => boolean): void
  {
    this.stars.forEach(star =>
    {
      star.getAllLinks().forEach(linkedStar =>
      {
        if (qualifierFN(star, linkedStar))
        {
          star.removeLink(linkedStar);
        }
      });
    });
  }
  private getNeighboringStars(): Star[]
  {
    return this.getUniqueStarsFromCallback(star =>
    {
      const neighborPoints = star.getNeighbors();

      return <Star[]> neighborPoints.filter((neighbor: Star) =>
      {
        const isFillerPoint = !isFinite(neighbor.id);
        return !isFillerPoint && !this.hasStar(neighbor);
      });
    });
  }
  private getUniqueStarsFromCallback(callbackFN: (star: Star) => Star[]): Star[]
  {
    const resultStars: Star[] = [];
    const alreadyAdded:
    {
      [starId: number]: boolean;
    } = {};

    this.stars.forEach(star =>
    {
      const starsFromCallback = callbackFN(star);
      const newStarsFromCallback = starsFromCallback.filter(star =>
      {
        return !alreadyAdded[star.id];
      });

      newStarsFromCallback.forEach(star =>
      {
        alreadyAdded[star.id] = true;
        resultStars.push(star);
      });
    });

    return resultStars;
  }
}
