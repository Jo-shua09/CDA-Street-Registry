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
import { useToast } from '@/hooks/use-toast';

interface Street {
  id: number;
  name: string;
  cda: string;
  state: string;
  lg: string;
  lcda: string;
  registrationDate: string;
  description: string;
}

interface StreetEditFormProps {
  street: Street;
  onClose: () => void;
  onSubmit: (streetData: Street) => void;
}

const cdaOptions = [
  "Phase 1 CDA",
  "Victoria CDA", 
  "Ikeja CDA",
  "Ikoyi CDA",
  "Lekki CDA",
  "Gbagada CDA"
];

const stateOptions = [
  "Lagos State",
  "Abuja FCT",
  "Rivers State",
  "Ogun State",
  "Kano State",
  "Kaduna State"
];

const lgOptions = [
  "Lagos Island LGA",
  "Lagos Mainland LGA", 
  "Surulere LGA",
  "Ikeja LGA",
  "Alimosho LGA",
  "Ikorodu LGA",
  "Kosofe LGA",
  "Mushin LGA",
  "Oshodi-Isolo LGA",
  "Shomolu LGA"
];

const lcdaOptions = [
  "Ikoyi/Obalende LCDA",
  "Lagos Island East LCDA",
  "Victoria Island LCDA",
  "Lekki LCDA",
  "Ikeja LCDA",
  "Allen Avenue LCDA",
  "Agege LCDA",
  "Surulere LCDA"
];

export const StreetEditForm = ({ street, onClose, onSubmit }: StreetEditFormProps) => {
  const [formData, setFormData] = useState({
    name: street.name,
    cda: street.cda,
    state: street.state,
    lg: street.lg,
    lcda: street.lcda,
    description: street.description,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cda || !formData.state || !formData.lg || !formData.lcda) {
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
      
      const updatedStreet = {
        ...street,
        ...formData,
      };

      onSubmit(updatedStreet);
      
      toast({
        title: "Street Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      
      onClose();
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Street Details</DialogTitle>
          <DialogDescription>
            Update the information for {street.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Street Name *</Label>
            <Input
              id="name"
              placeholder="Enter street name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lg">Local Government Area *</Label>
            <Select value={formData.lg} onValueChange={(value) => handleInputChange('lg', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {lgOptions.map((lg) => (
                  <SelectItem key={lg} value={lg}>
                    {lg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lcda">Local Council Development Area *</Label>
            <Select value={formData.lcda} onValueChange={(value) => handleInputChange('lcda', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select LCDA" />
              </SelectTrigger>
              <SelectContent>
                {lcdaOptions.map((lcda) => (
                  <SelectItem key={lcda} value={lcda}>
                    {lcda}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cda">Community Development Association *</Label>
            <Select value={formData.cda} onValueChange={(value) => handleInputChange('cda', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select CDA" />
              </SelectTrigger>
              <SelectContent>
                {cdaOptions.map((cda) => (
                  <SelectItem key={cda} value={cda}>
                    {cda}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the street"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Street'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};