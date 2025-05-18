import { useState } from 'react';
import { useProfile, usePasswordChange } from '@/hooks/useProfile';
import { ProfileUpdateData, ChangePasswordData } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Profile Page Component
 * Displays and manages user profile information
 */
export default function ProfilePage() {
  const {
    profile,
    loading,
    error,
    updateProfile,
    updateProfilePicture,
    deleteProfilePicture,
  } = useProfile();

  const { changePassword } = usePasswordChange();

  const [activeTab, setActiveTab] = useState('general');

  // Handle profile update
  const handleProfileUpdate = async (data: ProfileUpdateData) => {
    try {
      await updateProfile(data);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Handle password change
  const handlePasswordChange = async (data: ChangePasswordData) => {
    try {
      await changePassword(data);
    } catch (err) {
      console.error('Failed to change password:', err);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await updateProfilePicture(file);
      } catch (err) {
        console.error('Failed to upload profile picture:', err);
      }
    }
  };

  // Handle profile picture deletion
  const handleProfilePictureDelete = async () => {
    try {
      await deleteProfilePicture();
    } catch (err) {
      console.error('Failed to delete profile picture:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">
                      {profile.firstName[0]}
                      {profile.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profile-picture')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                {profile.avatar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProfilePictureDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your general profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleProfileUpdate({
                      firstName: formData.get('firstName') as string,
                      lastName: formData.get('lastName') as string,
                      phone: formData.get('phone') as string,
                      address: {
                        street: formData.get('street') as string,
                        city: formData.get('city') as string,
                        state: formData.get('state') as string,
                        pincode: formData.get('pincode') as string,
                        country: formData.get('country') as string,
                      },
                      preferences: {
                        notifications: formData.get('notifications') === 'true',
                        marketing: formData.get('marketing') === 'true',
                        language: formData.get('language') as string,
                      },
                    });
                  }}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={profile.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={profile.lastName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={profile.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          defaultValue={profile.phone}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Address</h3>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="street">Street</Label>
                          <Input
                            id="street"
                            name="street"
                            defaultValue={profile.address.street}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            defaultValue={profile.address.city}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            defaultValue={profile.address.state}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            defaultValue={profile.address.pincode}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            defaultValue={profile.address.country}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium">Preferences</h3>
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notifications">Email Notifications</Label>
                          <Switch
                            id="notifications"
                            name="notifications"
                            defaultChecked={profile.preferences.notifications}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="marketing">Marketing Emails</Label>
                          <Switch
                            id="marketing"
                            name="marketing"
                            defaultChecked={profile.preferences.marketing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select
                            name="language"
                            defaultValue={profile.preferences.language}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Update your password and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handlePasswordChange({
                      currentPassword: formData.get('currentPassword') as string,
                      newPassword: formData.get('newPassword') as string,
                      confirmPassword: formData.get('confirmPassword') as string,
                    });
                  }}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button type="submit">Change Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 