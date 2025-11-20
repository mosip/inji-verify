import { AnyVc, LdpVc } from "../types/data-types";

function hasRenderMethod(vc: AnyVc): vc is LdpVc {
  return (vc as LdpVc).renderMethod !== undefined;
}

export const getTemplateUrl = (vc: AnyVc): string | undefined => {
  if (!hasRenderMethod(vc)) return undefined;

  const renderMethod = Array.isArray(vc.renderMethod)
    ? vc.renderMethod.find(
        (r: any) =>
          r.renderSuite === "svg-mustache" &&
          r.template?.mediaType === "image/svg+xml"
      )
    : undefined;

  return renderMethod?.template?.id;
};

export const fetchSvgTemplate = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Failed to fetch SVG template:", res.statusText);
      return "";
    }
    return await res.text();
  } catch (err) {
    console.error("Error fetching SVG template:", err);
    return "";
  }
};
