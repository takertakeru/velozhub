import { Collection, DialogTrigger, MenuTrigger } from "react-aria-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretRightIcon,
  CubeTransparentIcon,
  HandHeartIcon,
  StarIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Calendar, RangeCalendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { CheckboxField, CheckboxGroup } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import type { ThemeColors } from "@/components/ui/constants";
import {
  DatePickerField,
  DateRangePickerField,
} from "@/components/ui/date-picker";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import { Dialog } from "@/components/ui/dialog";
import { Divider } from "@/components/ui/divider";
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/fieldset";
import { Input, InputField, PasswordInput } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Menu, MenuItem, MenuSection } from "@/components/ui/menu";
import { RadioField, RadioGroup } from "@/components/ui/radio";
import { Option, Select, SelectField } from "@/components/ui/select";
import { SurfaceActions } from "@/components/ui/surface";
import { SwitchField } from "@/components/ui/switch";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import { Tag, TagGroup, TagList } from "@/components/ui/tag";
import { Text, Title } from "@/components/ui/text";
import { TextareaField } from "@/components/ui/textarea";
import { TimePickerField } from "@/components/ui/time-picker";
import { cn, Group } from "@/components/ui/utils";
import { Content, Footer, Header } from "@/components/ui/view";

export const Route = createFileRoute("/preview")({
  /**
   * Preview page, this is only available during local development.
   * This is hidden in staging / production builds
   * We set VITE build import.meta.env.DEV to false.
   */
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  },
  component: RouteComponent,
});

const roles = [
  { id: 1, name: "Admin", description: "Has full access to all resources" },
  {
    id: 2,
    name: "Editor",
    description: "Can edit content but has limited access to settings",
  },
  {
    id: 3,
    name: "Viewer",
    description: "Can view content but cannot make changes",
  },
  {
    id: 4,
    name: "Contributor",
    description: "Can contribute content for review",
  },
  {
    id: 5,
    name: "Guest",
    description: "Limited access, mostly for viewing purposes",
  },
];

const buttonVariants: Array<"solid" | "outline" | "plain"> = [
  "solid",
  "outline",
  "plain",
];
// const emphasis: Array<Emphasis> = ["muted", "subtle", "bold"];
const themeColors: Array<ThemeColors> = [
  "primary",
  "neutral",
  "warning",
  "success",
  "danger",
  "info",
];

const schema = z.object({
  value: z.string(),
});

function RouteComponent() {
  const form = useForm({ resolver: zodResolver(schema) });

  return (
    <div className="p-4">
      <div className="gap-surface-gutter grid">
        <div className="gap-surface-gutter mt-1 grid sm:grid-cols-2 md:grid-cols-3">
          <Card className="items-center justify-center">
            <div className="grid grid-cols-3 gap-2">
              {themeColors.map((color) => {
                return buttonVariants.map((value) => {
                  return (
                    <Button key={color} color={color} variant={value}>
                      <WarningCircleIcon weight="fill" />
                      Submit
                    </Button>
                  );
                });
              })}
            </div>
          </Card>
          <Card className="items-center justify-center">
            <RadioGroup
              defaultValue="highSecurity"
              aria-label="Security settings"
            >
              {themeColors.map((color) => {
                return (
                  <RadioField
                    key={color}
                    color={color}
                    value={`highSecurity-${color}`}
                    label="High security"
                    description="Set all protections to maximum."
                  />
                );
              })}
            </RadioGroup>
          </Card>
          <Card className="items-center justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {themeColors.map((color) => {
                return (
                  <CheckboxField
                    defaultSelected
                    key={color}
                    color={color}
                    label="High security"
                    description="Encrypt all data at rest and in transit."
                  />
                );
              })}
            </div>
          </Card>
          <Card>
            <Header>
              <Title>Sign In</Title>
            </Header>
            <Content className="space-y-6">
              <form>
                <FieldGroup>
                  <InputField
                    type="date"
                    label="Email"
                    placeholder="Enter your email"
                  />
                  <Field>
                    <Label>Password</Label>
                    <PasswordInput placeholder="Enter your password" />
                  </Field>
                </FieldGroup>
              </form>
              <div className="flex items-center justify-between">
                <CheckboxField label="Remember me" />
                <Text>
                  <Link to="." className="font-medium hover:text-neutral-700">
                    Forgot password?
                  </Link>
                </Text>
              </div>
            </Content>
            <Footer>
              <Button className="w-full">Get Started</Button>
              <Text className="mt-8">
                Don&apos;t have an account?{" "}
                <Link to="." className="font-medium hover:text-neutral-700">
                  Sign Up
                </Link>
              </Text>
            </Footer>
          </Card>
          <Card className="items-center justify-center">
            <FieldGroup className="w-full max-w-sm">
              <Select
                aria-label="Select a role"
                placeholder="Select a role"
                items={roles}
              >
                {(item) => {
                  return (
                    <Option textValue={item.name}>
                      {/* <WarningCircleIcon /> */}
                      <Content>
                        <Label>{item.name}</Label>
                        <Description>{item.description}</Description>
                      </Content>
                    </Option>
                  );
                }}
              </Select>
              <Field>
                <Label>Country</Label>
                <Select aria-label="Select a role" placeholder="Select a role">
                  <Option textValue="Philippines">Philippines</Option>
                </Select>
                <Description>
                  We currently only ship to North America.
                </Description>
              </Field>
            </FieldGroup>
          </Card>
          <Card className="items-center justify-center">
            <DialogTrigger>
              <Button>Refund Payment</Button>
              <Dialog>
                <Header>
                  <Title>Refund Payment</Title>
                  <Description className="mt-2">
                    The refund will be reflected in the customer’s bank account
                    2 to 3 business days after processing.
                  </Description>
                </Header>
                <Content>
                  <form action="">
                    <FieldGroup>
                      <InputField label="Amount" placeholder="$0.00" />
                    </FieldGroup>
                  </form>
                </Content>
                <Footer className="mt-8">
                  <SurfaceActions>
                    <Button variant="plain" slot="close">
                      Cancel
                    </Button>
                    <Button>Refund</Button>
                  </SurfaceActions>
                </Footer>
              </Dialog>
            </DialogTrigger>
          </Card>
          <Card className="items-center justify-center">
            <DialogTrigger>
              <Button color="danger">Refund Payment</Button>
              <Dialog>
                <Header>
                  <Title>Refund Payment</Title>
                  <Description className="mt-2">
                    The refund will be reflected in the customer’s bank account
                    2 to 3 business days after processing.
                  </Description>
                </Header>
                <Footer className="mt-8">
                  <SurfaceActions>
                    <Button variant="plain" slot="close">
                      Cancel
                    </Button>
                    <Button color="danger">Refund me now</Button>
                  </SurfaceActions>
                </Footer>
              </Dialog>
            </DialogTrigger>
          </Card>
          <Card>
            <form>
              <Fieldset>
                <Legend>Shipping details</Legend>
                <Description>
                  Without this your odds of getting your order are low.
                </Description>
                <FieldGroup>
                  <InputField label="Street address" name="street_address" />
                  <SelectField
                    label="Country"
                    description="We currently only ship to North America."
                    name="country"
                  >
                    <Option>Canada</Option>
                    <Option>Mexico</Option>
                    <Option>United States</Option>
                  </SelectField>
                  <TextareaField
                    control={form.control}
                    field="value"
                    label="Delivery notes"
                    description="If you have a tiger, we'd like to know about it."
                    name="notes"
                  />
                </FieldGroup>
              </Fieldset>
              {/* ... */}
            </form>
          </Card>
          <Card className="grid items-center justify-center">
            <TagGroup>
              <TagList className="flex gap-3">
                <Tag color="success">documentation</Tag>
                <Tag color="warning">help wanted</Tag>
                <Tag color="danger">bug</Tag>
              </TagList>
            </TagGroup>
          </Card>
          <Card>
            <Label size="md" className="font-semibold">
              Team Members
            </Label>
            <div>
              <Description>
                Share this link with your team to give them access to your
                organization.
              </Description>
              <Group className="mt-3 flex gap-3">
                <Input
                  readOnly
                  value="https://example.com/teams/invite/eHGJEj12FHDKSi"
                />
                <Button variant="outline" className="shrink-0">
                  Copy Link
                </Button>
              </Group>
            </div>
          </Card>
          <Card className="items-center justify-center">
            <Calendar />
          </Card>
          <Card className="items-center justify-center">
            <DatePickerField
              label="Date of birth"
              className="w-full max-w-3xs"
              control={form.control}
              field="value"
            />
          </Card>
          <Card className="items-center justify-center">
            <Field>
              <Label>Select range</Label>
              <RangeCalendar />
            </Field>
          </Card>
          <Card className="col-span-2 items-center justify-center">
            <Field>
              <Label>Select range</Label>
              <RangeCalendar visibleDuration={{ months: 2 }} />
            </Field>
          </Card>
          <Card className="items-center justify-center">
            <DateRangePickerField
              label="Duration of stay"
              control={form.control}
              field="value"
            />
            <pre>{JSON.stringify(form.watch(), null, 2)}</pre>
          </Card>
          <Card className="items-center justify-center">
            <Fieldset>
              <Legend>Discoverability</Legend>
              <Description>
                Decide where your events can be found across the web.
              </Description>
              <CheckboxGroup>
                <CheckboxField
                  label="Show on events page"
                  name="discoverability"
                  value="show_on_events_page"
                  description="Make this event visible on your profile."
                />
                <CheckboxField
                  label="Allow embedding"
                  name="discoverability"
                  value="allow_embedding"
                  description="Allow others to embed your event details on their own site."
                />
              </CheckboxGroup>
            </Fieldset>
          </Card>
          <Card className="items-center justify-center">
            <TimePickerField label="Time of arrival" />
          </Card>
          <Card>
            <DescriptionList>
              <DescriptionTerm>Customer</DescriptionTerm>
              <DescriptionDetails>Michael Foster</DescriptionDetails>

              <DescriptionTerm>Event</DescriptionTerm>
              <DescriptionDetails>Bear Hug: Live in Concert</DescriptionDetails>

              <DescriptionTerm>Amount</DescriptionTerm>
              <DescriptionDetails>$150.00 USD</DescriptionDetails>

              <DescriptionTerm>Amount after exchange rate</DescriptionTerm>
              <DescriptionDetails>
                US$150.00 &rarr; CA$199.79
              </DescriptionDetails>

              <DescriptionTerm>Fee</DescriptionTerm>
              <DescriptionDetails>$4.79 USD</DescriptionDetails>

              <DescriptionTerm>Net</DescriptionTerm>
              <DescriptionDetails>$1,955.00</DescriptionDetails>
            </DescriptionList>
          </Card>
          <Card className="">
            <Tabs>
              <TabList>
                <Tab id="account">Account</Tab>
                <Tab id="settings">Settings</Tab>
              </TabList>
              <TabPanel id="account">
                <Header>
                  <Title>Personal Information</Title>
                  <Description>
                    This will be shown under the product title.
                  </Description>
                </Header>
              </TabPanel>
              <TabPanel id="settings">
                <Title>Settings</Title>
                <Description>
                  This will be shown under the product title.
                </Description>
              </TabPanel>
            </Tabs>
          </Card>
          <Card>
            <Field>
              <Label>Favorite Color</Label>
              <Combobox>
                <Option>Red</Option>
                <Option>Blue</Option>
                <Option>Yellow</Option>
                <Option>Orange</Option>
              </Combobox>
              <Description>
                We will use this color for the logo on your profile.
              </Description>
            </Field>
          </Card>
          <Card>
            <RadioGroup
              defaultValue="highSecurity"
              aria-label="Security settings"
            >
              <RadioField
                value="highSecurity"
                label="High security"
                description="Set all protections to maximum."
              />
              <CheckboxGroup
                aria-label="Advanced Security Features"
                defaultValue={["encryption", "firewall"]}
                className="ml-6"
              >
                <CheckboxField
                  value="encryption"
                  label="Encryption"
                  description="Encrypt all data at rest and in transit."
                />
                <CheckboxField
                  value="firewall"
                  label="Firewall"
                  description="Enable network firewall."
                />
              </CheckboxGroup>

              <RadioField
                value="balancedSecurity"
                label="Balanced security"
                description="Balance between protection and performance."
              />
              <RadioField
                isDisabled
                value="lowSecurity"
                label="Low security"
                description="Minimal protection enabled."
              />
            </RadioGroup>
          </Card>
          <Card>
            <Group adjoined orientation="vertical" className="flex flex-col">
              <DialogTrigger>
                <Button
                  variant="unstyled"
                  className={cn([
                    // Base
                    "relative isolate inline-flex w-full max-w-md items-start justify-center gap-x-3 rounded-t-(--radius-btn) border-x border-t text-sm",
                    //
                    "text-brand-neutral border-brand-neutral-muted bg-neutral-200/10 hover:bg-neutral-50",
                    // Padding
                    "px-4 py-2",
                    // Focus
                    "focus:outline-info-500 focus:outline-2 focus:outline-offset-2",
                    // Disabled
                    "disabled:opacity-50",
                    // Elevate button on focus when adjoined
                    "focus:group-data-[adjoined]:z-10",
                  ])}
                >
                  <HandHeartIcon
                    weight="fill"
                    className="text-brand-bold size-6"
                  />
                  <div className="flex flex-1 items-center">
                    <ul className="grid flex-1 gap-1 text-left font-light">
                      <li>Free Shipping</li>
                      <li>1% Credit Reward</li>
                      <li>Up to 30-day Returns</li>
                    </ul>
                    <CaretRightIcon className="size-4" />
                  </div>
                </Button>
                <Dialog size="xl">
                  <Content className="grid gap-8">
                    <div>
                      <Label className="font-medium" size="lg">
                        Free Shipping
                      </Label>
                      <Description className="mt-2">
                        Provides official products, comprehensive services and
                        free shipping for orders.
                      </Description>
                    </div>
                    <div>
                      <Label className="font-medium" size="lg">
                        1% DJI Credit Reward
                      </Label>
                      <Description className="mt-2">
                        1% DJI Credit reward on the paid value, which can be
                        used to reduce order amounts in the same currency unit
                        next time.
                      </Description>
                    </div>
                    <div>
                      <Label className="font-medium" size="lg">
                        Up to 30-Day Returns
                      </Label>
                      <Description className="mt-2">
                        Easy shopping with hassle-free returns and replacements.
                        *Some products have special return and replacement
                        policies. Please refer to the information on the
                        corresponding product detail page.
                      </Description>
                    </div>
                  </Content>
                </Dialog>
              </DialogTrigger>
              <Divider inset="unset" />
              <Button
                variant="unstyled"
                className={cn([
                  // Base
                  "relative isolate inline-flex w-full max-w-md items-start justify-center gap-x-3 rounded-b-(--radius-btn) border-x border-b text-sm",
                  //
                  "text-brand-neutral border-brand-neutral-muted bg-neutral-200/10 hover:bg-neutral-50",
                  // Padding
                  "px-4 py-2",
                  // Focus
                  "focus:outline-info-500 focus:outline-2 focus:outline-offset-2",
                  // Disabled
                  "disabled:opacity-50",
                  // Elevate button on focus when adjoined
                  "focus:group-data-[adjoined]:z-10",
                ])}
              >
                <CubeTransparentIcon
                  weight="fill"
                  className="text-brand-bold size-6"
                />
                <div className="flex flex-1 items-center">
                  <ul className="grid gap-1 text-left font-light">
                    <li>1-Inch CMOS &amp; 4K/120fps</li>
                    <li>
                      2-Inch Rotatable Screen &amp; Smart Horizontal-Vertical
                      Shooting
                    </li>
                    <li>3-Axis Gimbal Mechanical Stabilization</li>
                    <li>ActiveTrack 6.0</li>
                    <li>Full-Pixel Fast Focusing</li>
                    <li>D-Log M &amp; 10-Bit</li>
                    <li>Stereo Recording</li>
                    <li>Pocket-Sized Vlogging Camera</li>
                  </ul>
                </div>
              </Button>
            </Group>
          </Card>
          <Card className="grid place-content-center">
            <SwitchField
              label="Location services"
              description="Apps can access your location"
            />
            <SwitchField
              label="Email notifications"
              description="You will receive email notifications"
            />
            <SwitchField
              isDisabled
              label="Email notifications"
              description="You will receive email notifications"
            />
          </Card>
          <Card className="grid place-content-center">
            <MenuTrigger>
              <Button variant="outline" color="neutral">
                More Options
              </Button>
              <Menu>
                <MenuItem>
                  <StarIcon weight="fill" className="text-warning-500 size-4" />
                  <Label>Favorite</Label>
                  <Description>
                    This will be shown under the product title.
                  </Description>
                </MenuItem>
                <MenuItem>
                  <Label>Edit</Label>
                </MenuItem>
                <MenuItem color="danger">
                  <Label>Favorite</Label>
                  <Description>
                    This will be shown under the product title.
                  </Description>
                </MenuItem>
                <MenuItem>
                  <Label>Share</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
            <MenuTrigger>
              <Button variant="outline" color="neutral">
                Configure
              </Button>
              <Menu>
                <MenuSection>
                  <Header
                    className={cn([
                      "col-span-full grid grid-cols-[1fr_auto] gap-x-12 px-3.5 pt-2 pb-1 sm:px-3",
                    ])}
                  >
                    <Label
                      className="font-medium text-neutral-500"
                      color="unset"
                      size="xs"
                    >
                      Styles
                    </Label>
                  </Header>
                  <Collection>
                    <MenuItem>Edit Permissions</MenuItem>
                    <MenuItem color="danger">Delete User</MenuItem>
                  </Collection>
                </MenuSection>
              </Menu>
            </MenuTrigger>
          </Card>
        </div>
      </div>
    </div>
  );
}
