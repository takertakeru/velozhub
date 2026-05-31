import { MenuTrigger } from "react-aria-components";
import {
  CaretDownIcon,
  CaretUpDownIcon,
  ChartLineUpIcon,
  CurrencyDollarIcon,
  EyeIcon,
  GearIcon,
  HouseIcon,
  LightbulbIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  MailboxIcon,
  MegaphoneIcon,
  PlusIcon,
  QuestionMarkIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SquareIcon,
  TicketIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  SidebarLayout,
  SidebarLayoutContent,
} from "@/components/layouts/sidebar-layout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/fieldset";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";
import { Option, Select } from "@/components/ui/select";
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MetricText, Title } from "@/components/ui/text";
import { events, orders } from "./-layout-preview.data";

export const Route = createFileRoute("/layout-preview")({
  /**
   * Layout page, this is only available during local development.
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

function RouteComponent() {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem aria-label="Inbox">
              <MailboxIcon />
            </NavbarItem>
            <MenuTrigger>
              <NavbarItem>
                <Avatar
                  shape="square"
                  initials="EC"
                  alt="Erica"
                  className="text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1, #4338ca)",
                  }}
                />
              </NavbarItem>
              <Menu className="min-w-64">
                <MenuItem>
                  <UserIcon />
                  <Label>My profile</Label>
                </MenuItem>
                <MenuItem>
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <NavbarDivider />
                <MenuItem>
                  <ShieldCheckIcon />
                  <Label>Privacy policy</Label>
                </MenuItem>
                <MenuItem>
                  <LightbulbIcon />
                  <Label>Share feedback</Label>
                </MenuItem>
                <NavbarDivider />
                <MenuItem>
                  <SignOutIcon />
                  <Label>Sign out</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <MenuTrigger>
              <SidebarItem className="lg:mb-2.5">
                <Avatar
                  initials="TL"
                  alt="Tailwind Labs"
                  className="text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                  }}
                />
                <SidebarLabel>Tailwind Labs</SidebarLabel>
                <CaretDownIcon />
              </SidebarItem>
              <Menu className="min-w-80 lg:min-w-64">
                <MenuItem>
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem>
                  <Avatar
                    slot="icon"
                    initials="TL"
                    className="text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                    }}
                  />
                  <Label>Tailwind Labs</Label>
                </MenuItem>
                <MenuItem>
                  <Avatar
                    slot="icon"
                    initials="WC"
                    className="text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #a855f7, #6d28d9)",
                    }}
                  />
                  <Label>Workcation</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem>
                  <PlusIcon />
                  <Label>New team&hellip;</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem>
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <MailboxIcon />
                <SidebarLabel>Inbox</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem>
                <HouseIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <SquareIcon />
                <SidebarLabel>Events</SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <TicketIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <GearIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <MegaphoneIcon />
                <SidebarLabel>Broadcasts</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              <SidebarItem>Bear Hug: Live in Concert</SidebarItem>
              <SidebarItem>Viking People</SidebarItem>
              <SidebarItem>Six Fingers — DJ Set</SidebarItem>
              <SidebarItem>We All Look The Same</SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem>
                <QuestionMarkIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <MagicWandIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <MenuTrigger>
              <SidebarItem>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    shape="square"
                    initials="EC"
                    className="size-10 text-white"
                    alt="Erica"
                    style={{
                      background:
                        "linear-gradient(135deg, #6366f1, #4338ca)",
                    }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      Erica
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <CaretUpDownIcon />
              </SidebarItem>
              <Menu className="min-w-64">
                <MenuItem>
                  <UserIcon />
                  <Label>My profile</Label>
                </MenuItem>
                <MenuItem>
                  <GearIcon />
                  <Label>Settings</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem>
                  <ShieldCheckIcon />
                  <Label>Privacy policy</Label>
                </MenuItem>
                <MenuItem>
                  <LightbulbIcon />
                  <Label>Share feedback</Label>
                </MenuItem>
                <SidebarDivider />
                <MenuItem>
                  <SignOutIcon />
                  <Label>Sign out</Label>
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <SidebarLayoutContent className="p-8 lg:p-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
              Wednesday, May 8
            </p>
            <Title size="md" className="mt-2">
              Good afternoon, Erica
            </Title>
          </div>
          <div className="w-52">
            <Select name="period">
              <Option id="last_week" textValue="last_week">
                Last week
              </Option>
              <Option id="last_two" textValue="last_two">
                Last two weeks
              </Option>
              <Option id="last_month" textValue="last_month">
                Last month
              </Option>
              <Option id="last_quarter" textValue="last_quarter">
                Last quarter
              </Option>
            </Select>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            title="Total revenue"
            value="$2.6M"
            change="+4.5%"
            icon="revenue"
          />
          <Stat
            title="Average order value"
            value="$455"
            change="-0.5%"
            icon="aov"
          />
          <Stat
            title="Tickets sold"
            value="5,888"
            change="+4.5%"
            icon="tickets"
          />
          <Stat
            title="Pageviews"
            value="823,067"
            change="+21.2%"
            icon="pageviews"
          />
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(16,24,40,0.04),0_2px_4px_-1px_rgba(16,24,40,0.06),0_20px_40px_-16px_rgba(16,24,40,0.16)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_2px_4px_-1px_rgba(0,0,0,0.4),0_20px_40px_-16px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between px-12 py-6">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-white">
                Recent orders
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {orders.length} orders in the past 30 days
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: "var(--color-brand-primary-muted)",
                color: "var(--color-brand-primary-text)",
              }}
            >
              Live
            </span>
          </div>
          <Table
            bleed
            className="[&_td]:py-6 [&_th]:py-4 [&_td:first-child]:pl-12 [&_td:last-child]:pr-12 [&_th:first-child]:pl-12 [&_th:last-child]:pr-12"
          >
          <TableHeader>
            <TableRow>
              <TableColumn>Order number</TableColumn>
              <TableColumn>Purchase date</TableColumn>
              <TableColumn>Customer</TableColumn>
              <TableColumn>Event</TableColumn>
              <TableColumn className="text-right">Amount</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const event = events[order.eventId];

              return (
                <TableRow key={order.id} title={`Order #${order.id}`}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell className="text-zinc-500">{order.date}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        initials={event.initials}
                        alt={event.name}
                        className="size-7 text-white shadow-sm"
                        style={{ background: event.bg }}
                      />
                      <span className="font-medium">{event.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {order.amount.usd}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </SidebarLayoutContent>
    </SidebarLayout>
  );
}

const statIcons = {
  revenue: CurrencyDollarIcon,
  aov: ChartLineUpIcon,
  tickets: TicketIcon,
  pageviews: EyeIcon,
} as const;

function Stat({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: keyof typeof statIcons;
}) {
  const Icon = statIcons[icon];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(16,24,40,0.04),0_2px_4px_-1px_rgba(16,24,40,0.06),0_16px_32px_-12px_rgba(16,24,40,0.12)] transition-shadow hover:shadow-[0_0_0_1px_rgba(16,24,40,0.04),0_4px_8px_-2px_rgba(16,24,40,0.08),0_24px_48px_-16px_rgba(16,24,40,0.18)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_2px_4px_-1px_rgba(0,0,0,0.4),0_16px_32px_-12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <div className="text-sm/6 font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </div>
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{
            background: "var(--color-brand-primary-muted)",
            color: "var(--color-brand-primary-text)",
          }}
        >
          <Icon weight="bold" className="size-4.5" />
        </div>
      </div>
      <MetricText className="mt-4" size="xs">
        {value}
      </MetricText>
      <div className="mt-3 text-xs/6">
        <Badge
          content={change}
          color={change.startsWith("+") ? "success" : "danger"}
        />
        <span className="ml-1 inline-block text-neutral-500">
          from last week
        </span>
      </div>
    </div>
  );
}
