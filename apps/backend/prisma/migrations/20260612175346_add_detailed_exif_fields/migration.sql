-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "aperture" DOUBLE PRECISION,
ADD COLUMN     "camera_model" TEXT,
ADD COLUMN     "focal_length" DOUBLE PRECISION,
ADD COLUMN     "iso" INTEGER,
ADD COLUMN     "shutter_speed" TEXT;
