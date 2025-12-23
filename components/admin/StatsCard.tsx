import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
}

export default function StatsCard({ title, value, icon: Icon, iconColor, bgColor }: StatsCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${bgColor} p-4 rounded-full`}>
                    <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
