import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Store,
  Hotel,
  Building,
  Upload,
  X,
  FileImage,
  File
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyFormProps {
  property?: any;
  streetName: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const propertyTypes = [
  { value: 'House', label: 'House', icon: Home },
  { value: 'Shop', label: 'Shop', icon: Store },
  { value: 'Hotel', label: 'Hotel', icon: Hotel },
  { value: 'Office', label: 'Office', icon: Building },
];

export const PropertyForm = ({ property, streetName, onSubmit, onClose }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    number: property?.number || '',
    type: property?.type || '',
    owner: property?.owner || '',
    contact: property?.contact || '',
    description: property?.description || '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.type || !formData.owner) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const propertyData = {
        ...formData,
        files,
        streetName,
        registrationDate: property?.registrationDate || new Date().toISOString(),
      };

      onSubmit(propertyData);
      
      toast({
        title: property ? "Property Updated" : "Property Registered",
        description: `Property #${formData.number} has been ${property ? 'updated' : 'registered'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-primary" />;
    }
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {property ? 'Edit Property' : 'Register New Property'}
          </DialogTitle>
          <DialogDescription>
            {property 
              ? `Update property information for ${streetName}`
              : `Add a new property to ${streetName}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Street Context */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{streetName}</Badge>
                <span className="text-muted-foreground">→</span>
                <span className="text-foreground">
                  {property ? `Editing #${property.number}` : 'New Property'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Property Number *</Label>
              <Input
                id="number"
                placeholder="e.g., 15A, 23, Block C-7"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Owner Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner/Tenant Name *</Label>
              <Input
                id="owner"
                placeholder="Full name or business name"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                placeholder="Phone number or email"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the property, notable features, etc."
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label>Property Documents/Photos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-foreground">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Images, PDFs, and documents (Max 10MB each)
                </p>
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Uploaded Files ({files.length})</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getFileIcon(file)}
                        <span className="text-sm text-foreground truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (property ? 'Updating...' : 'Registering...') 
                : (property ? 'Update Property' : 'Register Property')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};