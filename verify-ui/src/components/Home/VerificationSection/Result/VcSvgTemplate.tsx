import { useEffect, useState } from "react";
import Mustache from "mustache";
import { AnyVc } from "../../../../types/data-types";
import { fetchSvgTemplate } from "../../../../utils/svg-template-utils";
import Loader from "../../../commons/Loader";
import DOMPurify from "dompurify";

interface VcSvgTemplateProps {
  vc: AnyVc;
  templateUrl: string;
  onError?: (error:Error) => void;
}

const VcSvgTemplate = ({ vc, templateUrl, onError }: VcSvgTemplateProps) => {
  const [templateContent, setTemplateContent] = useState<string>("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateUrl) {
        setLoader(false);
        return;
      }

      setLoader(true);
      try {
        const svgTemplate = await fetchSvgTemplate(templateUrl);
        if (svgTemplate) {
          setTemplateContent(svgTemplate);
          setLoader(false);
        } else {
          throw new Error("Failed to load credential template");
        }
      } catch (err) {
        console.error("Template fetch error:", err);
        onError?.(new Error(err instanceof Error ? err.message : "Failed to fetch template"));
      } finally {
        setLoader(false);
      }
    };
    loadTemplate();
  }, [onError, templateUrl]);

  if (loader) return <Loader innerBg="bg-white" className="w-5 h-5 mt-20" />;
  if (!templateContent) return null;

  try {
    const preprocessedTemplate = templateContent.replaceAll(
      /\{\{\/([^}]+)\}\}/g,
      (_, path) => {
        const trimmed = path.trim();
        return `{{${trimmed.replaceAll(/\//g, ".")}}}`;
      }
    );

    let renderedSvg = Mustache.render(preprocessedTemplate, vc);
    renderedSvg = DOMPurify.sanitize(renderedSvg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["use"],
      ADD_ATTR: ["target"],
      FORBID_TAGS: ["script", "iframe", "object", "embed"],
      FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    });
    return (
      <div className="w-full flex justify-center items-center">
        <div dangerouslySetInnerHTML={{ __html: renderedSvg }} />
      </div>
    );
  } catch (err) {
    console.error("Mustache render error:", err);
    onError?.(new Error(err instanceof Error ? err.message : "Failed to render template"));
    return null;
  }
};

export default VcSvgTemplate;
