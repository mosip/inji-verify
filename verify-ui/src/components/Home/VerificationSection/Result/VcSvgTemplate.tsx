import { useEffect, useState } from "react";
import Mustache from "mustache";
import { AnyVc } from "../../../../types/data-types";
import { fetchSvgTemplate } from "../../../../utils/svg-template-utils";
import Loader from "../../../commons/Loader";

const VcSvgTemplate = ({
  vc,
  templateUrl,
}: {
  vc: AnyVc;
  templateUrl: string;
}) => {
  const [templateContent, setTemplateContent] = useState<string>("");

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateUrl) {
        const svg = await fetchSvgTemplate(templateUrl);
        setTemplateContent(svg);
      }
    };
    loadTemplate();
  }, [templateUrl]);

  if (!templateContent)
    return <Loader innerBg="bg-white" className="w-5 h-5" />;

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
