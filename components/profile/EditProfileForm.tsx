import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Camera } from 'lucide-react';
import { UserData, EditData } from './types';

interface EditProfileFormProps {
  userData: UserData;
  editData: EditData;
  onEditDataChange: (data: EditData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  userData,
  editData,
  onEditDataChange,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          Edit Profil
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={onSave} size="sm" className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" />
            Simpan
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <X className="h-4 w-4 mr-2" />
            Batal
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Photo */}
        <div className="text-center">
          <Label className="text-foreground text-base mb-3 block">
            Foto Profil
          </Label>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              {userData.avatar ? (
                <img
                  src={userData.avatar || '/placeholder.svg'}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary-foreground">
                  {userData.name.charAt(0)}
                </span>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Ganti Foto
            </Button>
            <p className="text-xs text-muted-foreground">
              Format yang didukung: JPG, PNG. Maksimal 2MB.
            </p>
          </div>
        </div>

        {/* Username */}
        <div>
          <Label htmlFor="username" className="text-foreground">
            Username
          </Label>
          <Input
            id="username"
            value={editData.username}
            onChange={(e) =>
              onEditDataChange({
                username: e.target.value,
              })
            }
            placeholder="Masukkan username"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}

