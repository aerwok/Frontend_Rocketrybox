import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyDetails } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import type { CompanyDetails } from '@/types/onboarding';

/**
 * Company Details Page Component
 * Handles company information collection during seller onboarding
 */
export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const { details, loading, error, updateDetails, uploadDocuments } = useCompanyDetails();
  const [formData, setFormData] = useState<Partial<CompanyDetails>>({
    name: '',
    registrationNumber: '',
    taxId: '',
    businessType: 'individual',
    industry: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    contactPerson: {
      name: '',
      email: '',
      phone: '',
      position: '',
    },
  });

  // Update form data when details are loaded
  useEffect(() => {
    if (details) {
      setFormData({
        name: details.name,
        registrationNumber: details.registrationNumber,
        taxId: details.taxId,
        businessType: details.businessType,
        industry: details.industry,
        website: details.website || '',
        address: { ...details.address },
        contactPerson: { ...details.contactPerson },
      });
    }
  }, [details]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      await uploadDocuments(Array.from(files), type as any);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDetails(formData);
      toast.success('Company details updated successfully');
      navigate('/seller/onboarding/bank-details');
    } catch (err) {
      console.error('Error updating company details:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Company Details</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Registration Number</label>
              <Input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax ID</label>
              <Input
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleSelectChange('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Input
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website (Optional)</label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                type="url"
              />
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <Input
                name="address.street"
                value={formData.address?.street}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                name="address.city"
                value={formData.address?.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <Input
                name="address.state"
                value={formData.address?.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                name="address.country"
                value={formData.address?.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <Input
                name="address.zipCode"
                value={formData.address?.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </Card>

        {/* Contact Person Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Person Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="contactPerson.name"
                value={formData.contactPerson?.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="contactPerson.email"
                value={formData.contactPerson?.email}
                onChange={handleInputChange}
                type="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                name="contactPerson.phone"
                value={formData.contactPerson?.phone}
                onChange={handleInputChange}
                type="tel"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <Input
                name="contactPerson.position"
                value={formData.contactPerson?.position}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </Card>

        {/* Document Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Registration Certificate</label>
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, 'registrationCertificate')}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Certificate</label>
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, 'taxCertificate')}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business License</label>
              <Input
                type="file"
                onChange={(e) => handleFileUpload(e, 'businessLicense')}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
            Save and Continue
          </Button>
        </div>
      </form>
    </div>
  );
} 