import '@types/google.maps';
import type { Document, WithId } from 'mongodb';

type PendingMarkerData = WithId<Document> & {
	lat: number;
	lng: number;
	textRaw: string;
	textHTML: string;
	source: {
		ip: string;
		headers: string[];
	};
};
