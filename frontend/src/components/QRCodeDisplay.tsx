import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Share2, Smartphone } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";

interface QRCodeDisplayProps {
  menuUrl: string;
}

const QRCodeDisplay = ({ menuUrl }: QRCodeDisplayProps) => {
  const handleDownload = () => {
    const svg = document.querySelector("#menu-qr-code svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${restaurantInfo.name.toLowerCase().replace(/\s+/g, "-")}-menu-qr.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantInfo.name} Menu`,
          text: `Scan to view our digital menu!`,
          url: menuUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(menuUrl);
      alert("Menu link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="inline-block p-8 bg-card rounded-3xl shadow-elevated" id="menu-qr-code">
        <div className="bg-gradient-to-br from-primary/10 to-warm-amber/10 p-6 rounded-2xl">
          <QRCodeSVG
            value={menuUrl}
            size={220}
            level="H"
            includeMargin={true}
            bgColor="transparent"
            fgColor="hsl(30, 15%, 15%)"
            imageSettings={{
              src: "",
              height: 0,
              width: 0,
              excavate: false,
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 space-y-4"
      >
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Smartphone className="w-5 h-5" />
          <span className="text-sm">Scan with your phone camera</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 gradient-warm text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-4 h-4" />
            Share Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRCodeDisplay;
