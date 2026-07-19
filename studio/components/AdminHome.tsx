import { Box, Button, Card, Flex, Grid, Heading, Stack, Text } from "@sanity/ui";
import { IntentLink } from "sanity/router";

const createActions = [
  { label: "New project", type: "portfolioProject" },
  { label: "New article", type: "portfolioArticle" },
  { label: "New talk", type: "portfolioTalk" },
  { label: "New CV role", type: "portfolioExperience" },
];

const editActions = [
  { label: "Arrange the homepage", id: "portfolio-homepage", type: "portfolioHomepage" },
  { label: "Change page order and introductions", id: "portfolio-collections", type: "portfolioCollections" },
  { label: "Change the look and navigation", id: "portfolio-site-settings", type: "portfolioSiteSettings" },
];

export function AdminHome() {
  return (
    <Box padding={[4, 5, 6]}>
      <Stack space={6}>
        <Stack space={3}>
          <Text size={1} muted>PERSONAL SITE</Text>
          <Heading size={4}>What do you want to change?</Heading>
          <Text size={2} muted>
            Add content first, then decide where it appears. Publishing makes the change live; drafts stay private.
          </Text>
        </Stack>

        <Card padding={5} radius={3} border tone="primary">
          <Stack space={4}>
            <Heading size={2}>Add something</Heading>
            <Grid columns={[1, 2]} gap={3}>
              {createActions.map((action) => (
                <Button
                  as={IntentLink}
                  key={action.type}
                  intent="create"
                  params={{ type: action.type }}
                  mode="ghost"
                  padding={4}
                  text={action.label}
                />
              ))}
            </Grid>
          </Stack>
        </Card>

        <Card padding={5} radius={3} border>
          <Stack space={4}>
            <Heading size={2}>Arrange and style the site</Heading>
            <Stack space={3}>
              {editActions.map((action) => (
                <Button
                  as={IntentLink}
                  key={action.id}
                  intent="edit"
                  params={{ id: action.id, type: action.type }}
                  mode="bleed"
                  padding={4}
                  text={action.label}
                  tone="default"
                />
              ))}
            </Stack>
          </Stack>
        </Card>

        <Grid columns={[1, 3]} gap={3}>
          {[
            ["1", "Create", "Add a project, article, talk or CV role."],
            ["2", "Arrange", "Drag rows and references into the order you want."],
            ["3", "Publish", "Review the fields, then publish when it is ready."],
          ].map(([number, title, body]) => (
            <Card key={number} padding={4} radius={2} border>
              <Stack space={3}>
                <Flex align="center" gap={3}>
                  <Text size={1} muted>{number}</Text>
                  <Heading size={1}>{title}</Heading>
                </Flex>
                <Text size={1} muted>{body}</Text>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
