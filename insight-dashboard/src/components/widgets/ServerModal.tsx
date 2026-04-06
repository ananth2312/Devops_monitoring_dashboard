import { useState, useEffect } from "react";
import { Server } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServers } from "@/hooks/useServers";
import { toast } from "sonner";

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverToEdit?: Server | null;
}

export const ServerModal = ({ isOpen, onClose, serverToEdit }: ServerModalProps) => {
  const { addServer, updateServer } = useServers();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Server>>({
    name: "",
    ip: "",
    status: "healthy",
    cpu: 0,
    memory: 0,
    disk: 0,
    environment: "production",
    location: "us-east-1"
  });

  useEffect(() => {
    if (serverToEdit) {
      setFormData(serverToEdit);
    } else {
      setFormData({
        name: "",
        ip: "",
        status: "healthy",
        cpu: 0,
        memory: 0,
        disk: 0,
        environment: "production",
        location: "us-east-1"
      });
    }
  }, [serverToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (serverToEdit?.id) {
        await updateServer({ ...formData, id: serverToEdit.id });
        toast.success("Server updated successfully!");
      } else {
        await addServer(formData);
        toast.success("Server added successfully!");
      }
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{serverToEdit ? "Edit Server" : "Add Server"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Server Name</Label>
            <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ip">IP Address</Label>
            <Input id="ip" name="ip" value={formData.ip || ""} onChange={handleChange} required placeholder="192.168.1.1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select value={formData.environment} onValueChange={(val) => setFormData(prev => ({ ...prev, environment: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={formData.status} onValueChange={(val: "healthy" | "warning" | "critical" | "offline") => setFormData(prev => ({ ...prev, status: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location} onValueChange={(val) => setFormData(prev => ({ ...prev, location: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east-1">us-east-1 (N. Virginia)</SelectItem>
                <SelectItem value="us-east-2">us-east-2 (Ohio)</SelectItem>
                <SelectItem value="us-west-1">us-west-1 (N. California)</SelectItem>
                <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
                <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
                <SelectItem value="eu-central-1">eu-central-1 (Frankfurt)</SelectItem>
                <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                <SelectItem value="ap-northeast-1">ap-northeast-1 (Tokyo)</SelectItem>
                <SelectItem value="ap-southeast-1">ap-southeast-1 (Singapore)</SelectItem>
                <SelectItem value="ap-southeast-2">ap-southeast-2 (Sydney)</SelectItem>
                <SelectItem value="sa-east-1">sa-east-1 (São Paulo)</SelectItem>
                <SelectItem value="ca-central-1">ca-central-1 (Central)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
