'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  ProfileHeader,
  LevelProgressCard,
  ProfileStatsCard,
  EditProfileForm,
  initialUserData,
} from '@/components/profile';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [editData, setEditData] = useState({
    username: userData.username,
  });

  const handleSaveProfile = () => {
    setUserData((prev) => ({
      ...prev,
      username: editData.username,
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      username: userData.username,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <Card>
          <CardContent className="p-4 sm:p-6 md:p-8">
            {!isEditing ? (
              <>
                <ProfileHeader
                  userData={userData}
                  onEditClick={() => setIsEditing(true)}
                />

                <LevelProgressCard userData={userData} />

                <ProfileStatsCard userData={userData} />
              </>
            ) : (
              <EditProfileForm
                userData={userData}
                editData={editData}
                onEditDataChange={setEditData}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
