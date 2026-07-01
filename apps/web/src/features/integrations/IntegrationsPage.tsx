import { ArrowLeft, CircleHelp, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import googleChatIcon from "../../../assets/integrations/google-chat.svg";
import microsoftTeamsIcon from "../../../assets/integrations/microsoft-teams.svg";
import zapierIcon from "../../../assets/integrations/zapier.png";
import { INTEGRATIONS, type Integration } from "./data";

type Tile = {
  id: string;
  name: string;
  desc?: string;
  icon?: string;
  mark?: string;
  tone?: string;
  recommended?: boolean;
};

const app = (id: string) => INTEGRATIONS.find((item) => item.id === id);

const collaborationTools: Tile[] = [
  app("slack"),
  { id: "microsoft-teams", name: "Microsoft Teams", icon: microsoftTeamsIcon },
  { id: "google-chat", name: "Google Chat", icon: googleChatIcon },
  { id: "zapier", name: "Zapier", icon: zapierIcon },
  { id: "jostle", name: "Jostle", mark: "J", tone: "#242424" },
].filter(Boolean) as Tile[];

const userManagement: Tile[] = [
  {
    id: "hris-connect",
    name: "Connect HRIS or HRMS software",
    desc: "Seamlessly integrate your Human Resources Information or Management System.",
    recommended: true,
  },
  app("darwinbox"),
  app("keka"),
].filter(Boolean) as Tile[];

const displayTools: Tile[] = [
  app("google-workspace"),
  app("razorpay"),
  app("shiprocket"),
].filter(Boolean) as Tile[];

function asTile(item: Integration | Tile): Tile {
  return {
    id: item.id,
    name: item.name,
    desc: "desc" in item ? item.desc : undefined,
    icon: "icon" in item ? item.icon : undefined,
    mark: "mark" in item ? item.mark : undefined,
    tone: "tone" in item ? item.tone : undefined,
    recommended: "recommended" in item ? item.recommended : undefined,
  };
}

function IntegrationTile({
  item,
  detail = false,
  onSelect,
}: {
  item: Tile | Integration;
  detail?: boolean;
  onSelect: (tile: Tile) => void;
}) {
  const tile = asTile(item);

  return (
    <button
      type="button"
      className={`bonus-integ-tile${detail ? " bonus-integ-tile--detail" : ""}`}
      onClick={() => onSelect(tile)}
    >
      {(tile.icon || tile.mark) && (
        <span className="bonus-integ-logo" aria-hidden="true">
          {tile.icon ? (
            <img src={tile.icon} alt="" />
          ) : (
            <span style={{ background: tile.tone }}>{tile.mark}</span>
          )}
        </span>
      )}
      <span className="bonus-integ-copy">
        <span className="bonus-integ-name">{tile.name}</span>
        {tile.recommended && <span className="bonus-integ-recommended">Recommended</span>}
        {detail && tile.desc && <span className="bonus-integ-desc">{tile.desc}</span>}
      </span>
    </button>
  );
}

function IntegrationMark({ tile, size = "normal" }: { tile: Tile; size?: "normal" | "large" }) {
  return (
    <span className={`bonus-integ-logo bonus-integ-logo--${size}`} aria-hidden="true">
      {tile.icon ? (
        <img src={tile.icon} alt="" />
      ) : (
        <span style={{ background: tile.tone }}>{tile.mark}</span>
      )}
    </span>
  );
}

function detailCopy(tile: Tile) {
  if (tile.id === "slack") {
    return "Install our Slack app to announce gifting activity in Slack and create gift moments without leaving Slack.";
  }
  if (tile.id === "microsoft-teams") {
    return "Install our Microsoft Teams app to announce gifting activity and keep employee moments visible in team channels.";
  }
  if (tile.id === "google-chat") {
    return "Connect Google Chat to share gifting updates with the right spaces automatically.";
  }
  if (tile.id === "hris-connect") {
    return "Choose your HRIS or HRMS provider and keep employee data synced for automated gifting workflows.";
  }
  return tile.desc ?? `Connect ${tile.name} to ShelfMerch and automate this part of your gifting workflow.`;
}

function IntegrationDetail({ tile, onBack }: { tile: Tile; onBack: () => void }) {
  return (
    <div className="bonus-integ-detail-page">
      <button type="button" className="bonus-integ-back" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Back to integrations</span>
      </button>
      <div className="bonus-integ-detail-card">
        {(tile.icon || tile.mark) && <IntegrationMark tile={tile} size="large" />}
        <h1>{tile.name} Integration</h1>
        <p>{detailCopy(tile)}</p>
        <button
          type="button"
          className="bonus-integ-install"
          onClick={() => toast(`${tile.name} setup started`)}
        >
          {(tile.icon || tile.mark) && <IntegrationMark tile={tile} />}
          <span>{tile.id === "hris-connect" ? "Choose provider" : `Add to ${tile.name}`}</span>
        </button>
        <div className="bonus-integ-help">
          <CircleHelp size={14} aria-hidden="true" />
          <span>Can't figure it out? Just </span>
          <button type="button" onClick={() => toast("Support message opened")}>
            drop us a line.
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <section className="bonus-integ-section">
      <h2>{title}</h2>
      <p>{desc}</p>
      {children}
    </section>
  );
}

export function IntegrationsPage() {
  const [selected, setSelected] = useState<Tile | null>(null);

  if (selected) {
    return <IntegrationDetail tile={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="bonus-integ-page">
      <h1>Integrations</h1>

      <Section
        title="Collaboration tools"
        desc="Connect ShelfMerch to your existing chat or workflow tools so your team can see gifting updates where they work."
      >
        <div className="bonus-integ-grid bonus-integ-grid--compact">
          {collaborationTools.map((item) => (
            <IntegrationTile item={item} key={item.id} onSelect={setSelected} />
          ))}
        </div>
      </Section>

      <Section
        title="User management"
        desc="Connect your HRIS or HRMS software to automatically sync user information, including employee names, emails, and more."
      >
        <div className="bonus-integ-grid bonus-integ-grid--detail">
          {userManagement.map((item) => (
            <IntegrationTile detail item={item} key={item.id} onSelect={setSelected} />
          ))}
        </div>
      </Section>

      <Section
        title="Single sign-on"
        desc="Enable single sign-on (SSO) to protect your company's account information."
      >
        <div className="bonus-integ-plan">
          <div className="bonus-integ-plan-h">
            <LockKeyhole size={17} aria-hidden="true" />
            <h3>Single Sign-On (SSO)</h3>
          </div>
          <p>
            Configure SAML-based Single Sign-On to let your team sign in to ShelfMerch using your
            identity provider.
          </p>
          <strong>Available on the Enterprise plan</strong>
          <button type="button" onClick={() => toast("Plan details opened")}>
            View plans
          </button>
        </div>
      </Section>

      <Section
        title="ShelfMerch display"
        desc="Maximize the impact of gifting across the tools your employees already use."
      >
        <div className="bonus-integ-grid bonus-integ-grid--detail">
          {displayTools.map((item) => (
            <IntegrationTile detail item={item} key={item.id} onSelect={setSelected} />
          ))}
        </div>
      </Section>
    </div>
  );
}
