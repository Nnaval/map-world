import React from "react";
import StatusViewer from "./StatusViewerDrawer";
import { Drawer, DrawerContent } from "@components/ui/drawer";

const StatusDrawer = ({ open, openChange, shopName, image, status }) => {
  const data = {
    name: shopName,
    image: image,
    status: status,
  };
  return (
    <Drawer open={open} onOpenChange={openChange} snapPoint={100}>
      <DrawerContent className="h-screen overflow-hidden p-1 bg-black">
        {/* Status Viewer occupies full height of DrawerContent */}
        <StatusViewer storeStatusUpdates={data} onClose={openChange} />
      </DrawerContent>
    </Drawer>
  );
};

export default StatusDrawer;
