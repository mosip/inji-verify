import { useEffect, useState } from "react";
import Mustache from "mustache";
import { AnyVc } from "../../../../types/data-types";
import { fetchSvgTemplate } from "../../../../utils/svg-template-utils";
import Loader from "../../../commons/Loader";
import DOMPurify from "dompurify";

const VcSvgTemplate = ({
  vc,
  templateUrl,
}: {
  vc: AnyVc;
  templateUrl: string;
}) => {
  const [templateContent, setTemplateContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateUrl) {
        setLoader(true);
        const svgTemplate = await fetchSvgTemplate(templateUrl);
        if (svgTemplate) {
          setTemplateContent(svgTemplate);
          setLoader(false);
        } else {
          setError("Failed to load credential template");
          setLoader(false);
        }
      }
    };
    loadTemplate();
  }, [templateUrl]);

  if (error) {
    return <div className="text-red-500 text-sm text-center p-3 mt-10">{error}</div>;
  }

  if (loader)
    return <Loader innerBg="bg-white" className="w-5 h-5 mt-20" />;

  const preprocessedTemplate = templateContent.replace(
    /\{\{\/([^}]+)\}\}/g,
    (_, path) => {
      const trimmed = path.trim();

      if (trimmed.includes("/")) {
        return `{{${trimmed.replace(/\//g, ".")}}}`;
      }

      return `{{${trimmed}}}`;
    }
  );

  let renderedSvg: string;
  try {
    renderedSvg = Mustache.render(preprocessedTemplate, vc);
    renderedSvg = DOMPurify.sanitize(renderedSvg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["use"],
      ADD_ATTR: ["target"],
      FORBID_TAGS: ["script", "iframe", "object", "embed"],
      FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    });
  } catch (err) {
    console.error("Mustache render error:", err);
    return (
      <div className="text-red-500 text-sm text-center p-3">
        Failed to render credential:{" "}
        {err instanceof Error ? err.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <div
        className="w-full flex justify-center items-center"
        dangerouslySetInnerHTML={{ __html: renderedSvg }}
      />
    </div>
  );
};

export default VcSvgTemplate;
