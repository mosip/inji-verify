import { AnyVc } from "../types/data-types";

export const getTemplateUrl = (vc: AnyVc): string | undefined => {
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
