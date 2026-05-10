import Main from "@/components/commander/universities/[organizations]/[classes]/Main";

interface Props {
  params: {
    organizations: string;
    educationLevels: string;
    classes: string;
  };
}

export default async function Page({ params }: Props) {
  const { classes: educationLevelId } = await params;
  return <Main educationLevelId={educationLevelId} />;
}
