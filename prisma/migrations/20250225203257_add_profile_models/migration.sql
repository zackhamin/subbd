-- This is the fixed migration file that handles existing data

/*
  Warnings:

  - You are about to drop the column `openToWork` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `websiteUrl` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `jobId` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `resumeId` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `allowSubscription` on the `Recruiter` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Recruiter` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Recruiter` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Recruiter` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Recruiter` table. All the data in the column will be lost.
  - You are about to drop the column `websiteUrl` on the `Recruiter` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `ApplicantFollowsRecruiter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicantSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecruiterDesiredSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resume` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicantId,name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
*/

-- DropForeignKey
ALTER TABLE "ApplicantFollowsRecruiter" DROP CONSTRAINT "ApplicantFollowsRecruiter_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantFollowsRecruiter" DROP CONSTRAINT "ApplicantFollowsRecruiter_recruiterId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantSkill" DROP CONSTRAINT "ApplicantSkill_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantSkill" DROP CONSTRAINT "ApplicantSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_recruiterId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "JobSkill" DROP CONSTRAINT "JobSkill_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobSkill" DROP CONSTRAINT "JobSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_recruiterId_fkey";

-- DropForeignKey
ALTER TABLE "RecruiterDesiredSkill" DROP CONSTRAINT "RecruiterDesiredSkill_recruiterId_fkey";

-- DropForeignKey
ALTER TABLE "RecruiterDesiredSkill" DROP CONSTRAINT "RecruiterDesiredSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_applicantId_fkey";

-- DropIndex
DROP INDEX "Skill_name_key";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "openToWork",
DROP COLUMN "phone",
DROP COLUMN "websiteUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "yearsOfExperience" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "from" TEXT NOT NULL DEFAULT '2020',
ADD COLUMN     "to" TEXT,
ALTER COLUMN "degree" SET DEFAULT 'Not Specified',
ALTER COLUMN "degree" SET NOT NULL,
ALTER COLUMN "fieldOfStudy" SET DEFAULT 'Not Specified',
ALTER COLUMN "fieldOfStudy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "endDate",
DROP COLUMN "location",
DROP COLUMN "startDate",
DROP COLUMN "title",
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position" TEXT NOT NULL DEFAULT 'Not Specified',
ADD COLUMN     "to" TIMESTAMP(3);

-- Create JobListing table first before altering JobApplication
CREATE TABLE "JobListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "location" TEXT,
    "salary" TEXT,
    "type" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "JobListing_pkey" PRIMARY KEY ("id")
);

-- Insert a placeholder JobListing if needed for existing JobApplications
INSERT INTO "JobListing" (id, title, description, "recruiterId")
SELECT 
    'placeholder-job-listing', 
    'Placeholder Listing', 
    'This is a placeholder listing for migration purposes', 
    (SELECT id FROM "Recruiter" LIMIT 1)
WHERE EXISTS (SELECT 1 FROM "JobApplication");

-- Now we can safely alter the JobApplication table
ALTER TABLE "JobApplication" DROP COLUMN "jobId",
DROP COLUMN "resumeId",
ADD COLUMN     "jobListingId" TEXT NOT NULL DEFAULT 'placeholder-job-listing',
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Recruiter" DROP COLUMN "allowSubscription",
DROP COLUMN "bio",
DROP COLUMN "location",
DROP COLUMN "title",
DROP COLUMN "verified",
DROP COLUMN "websiteUrl",
ADD COLUMN     "companyDescription" TEXT,
ADD COLUMN     "companyLocation" TEXT,
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "companyName" SET DEFAULT 'Company Name',
ALTER COLUMN "companyName" SET NOT NULL;

-- Find an applicant ID for skills if we have any
DO $$
DECLARE
    first_applicant_id TEXT;
BEGIN
    SELECT id INTO first_applicant_id FROM "Applicant" LIMIT 1;
    
    IF first_applicant_id IS NULL THEN
        -- If there are no applicants but there are skills, create a placeholder applicant
        IF EXISTS (SELECT 1 FROM "Skill") THEN
            INSERT INTO "Applicant" (id, headline, updatedAt)
            VALUES ('placeholder-applicant', 'Placeholder Applicant', CURRENT_TIMESTAMP);
            first_applicant_id := 'placeholder-applicant';
        END IF;
    END IF;

    -- Only try to alter the Skill table if we have a valid applicant ID or no skills
    IF first_applicant_id IS NOT NULL OR NOT EXISTS (SELECT 1 FROM "Skill") THEN
        -- AlterTable for Skill
        ALTER TABLE "Skill" DROP COLUMN "category",
        ADD COLUMN "applicantId" TEXT NOT NULL DEFAULT COALESCE(first_applicant_id, 'placeholder-applicant');
    END IF;
END $$;

-- DropTable
DROP TABLE "ApplicantFollowsRecruiter";
DROP TABLE "ApplicantSkill";
DROP TABLE "Job";
DROP TABLE "JobSkill";
DROP TABLE "Post";
DROP TABLE "RecruiterDesiredSkill";
DROP TABLE "Resume";

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_recruiterId_name_key" ON "Specialization"("recruiterId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_applicantId_recruiterId_key" ON "Follow"("applicantId", "recruiterId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_applicantId_name_key" ON "Skill"("applicantId", "name");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialization" ADD CONSTRAINT "Specialization_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobListing" ADD CONSTRAINT "JobListing_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "JobListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Optional: Remove the default constraints after migration
-- These lines should be run after the migration is complete if you want to remove the defaults
ALTER TABLE "Applicant" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Education" ALTER COLUMN "from" DROP DEFAULT;
ALTER TABLE "Education" ALTER COLUMN "degree" DROP DEFAULT;
ALTER TABLE "Education" ALTER COLUMN "fieldOfStudy" DROP DEFAULT;
ALTER TABLE "Experience" ALTER COLUMN "from" DROP DEFAULT;
ALTER TABLE "Experience" ALTER COLUMN "position" DROP DEFAULT;
ALTER TABLE "JobApplication" ALTER COLUMN "jobListingId" DROP DEFAULT;
ALTER TABLE "JobListing" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Recruiter" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Recruiter" ALTER COLUMN "companyName" DROP DEFAULT;
ALTER TABLE "Skill" ALTER COLUMN "applicantId" DROP DEFAULT;