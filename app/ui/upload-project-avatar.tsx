'use client';

import { useState } from 'react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateProjectAvatar } from "@/app/controllers/project-controllers";

interface UploadProjectAvatarProps {
    projectId: string;
    currentAvatar?: string | null;
}


export function UploadProjectAvatar({ projectId, currentAvatar }: UploadProjectAvatarProps) {
    const [avatar, setAvatar] = useState<string | undefined>(currentAvatar || undefined);
    const [isUploading, setIsUploading] = useState(false);



    const handleUploadSuccess = async (results: CloudinaryUploadWidgetResults) => {
        const imageUrl = typeof results.info === 'object' && results.info.secure_url 
            ? results.info.secure_url 
            : undefined;
        
        if (!imageUrl) {
            console.error('No image URL found in upload results');
            return;
        }

        setAvatar(imageUrl);

        try {
            setIsUploading(true);
            await updateProjectAvatar(projectId, imageUrl);
            setIsUploading(false);
        } catch (error) {
            console.error('Error updating project avatar:', error);
            setIsUploading(false);
        }
    };

    return (
        <div >
            <CldUploadWidget
                uploadPreset="flashcard"
                onSuccess={handleUploadSuccess}
            >
                {({ open }) => {

                    return (
                        <div className=''>
                        <Avatar className="h-9 w-9 ml-2">
                                <AvatarImage src={avatar ?? undefined} alt="Project avatar" />
                                <AvatarFallback>
                                    {isUploading ? 'Uploading...' : 'Avatar'}
                                </AvatarFallback>
                            </Avatar>

                        <Button
                            className='text-xs p-0 text-primary font-semibold'
                            variant="ghost"
                            onClick={() => open()}
                            disabled={isUploading}
                        >                           
                          + upload  
                        </Button>
                        </div>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}