import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Profile Picture Component
 * Handles profile picture display, upload, and deletion
 */
const ProfilePicture = () => {
    const { profile, uploadProfilePicture, deleteProfilePicture, isLoading } = useProfile();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        try {
            await uploadProfilePicture(file);
        } catch (error) {
            // Error is handled in the hook
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        try {
            await uploadProfilePicture(file);
        } catch (error) {
            // Error is handled in the hook
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div
                className={`relative w-32 h-32 rounded-full overflow-hidden border-2 ${
                    isDragging ? 'border-blue-500' : 'border-gray-200'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {profile?.avatar ? (
                    <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">
                            {profile?.firstName?.[0] || '?'}
                        </span>
                    </div>
                )}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}
            </div>
            <div className="flex space-x-2">
                <label className="cursor-pointer">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button variant="outline" size="sm" disabled={isLoading}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </Button>
                </label>
                {profile?.avatar && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={deleteProfilePicture}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
};

/**
 * Personal Information Form Component
 * Handles updating personal information
 */
const PersonalInformationForm = () => {
    const { profile, updateProfile, isLoading } = useProfile();
    const [formData, setFormData] = useState({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: profile?.phone || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
        } catch (error) {
            // Error is handled in the hook
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                    </>
                ) : (
                    'Save Changes'
                )}
            </Button>
        </form>
    );
};

/**
 * Change Password Form Component
 * Handles password updates
 */
const ChangePasswordForm = () => {
    const { changePassword, isLoading } = useProfile();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            await changePassword(formData);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            // Error is handled in the hook
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing Password...
                    </>
                ) : (
                    'Change Password'
                )}
            </Button>
        </form>
    );
};

/**
 * Profile Page Component
 * 
 * Displays user profile with:
 * - Profile picture management
 * - Personal information
 * - Password change
 * - Loading states
 * - Error handling
 */
const ProfilePage = () => {
    const { profile, isLoading, error } = useProfile();

    if (isLoading) {
        return (
            <div className="container mx-auto py-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="p-6">
                    <ProfilePicture />
                </Card>

                <Tabs defaultValue="personal" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="personal">Personal Information</TabsTrigger>
                        <TabsTrigger value="password">Change Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                        <Card className="p-6">
                            <PersonalInformationForm />
                        </Card>
                    </TabsContent>

                    <TabsContent value="password">
                        <Card className="p-6">
                            <ChangePasswordForm />
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ProfilePage; 