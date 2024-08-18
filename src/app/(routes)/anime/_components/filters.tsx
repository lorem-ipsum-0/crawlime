"use client";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/ui/button";
import { Card, CardContent, CardHeader } from "~/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "~/ui/form";
import { Input } from "~/ui/input";
import MultiCombobox from "~/ui/multi-combobox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";
import { Slider } from "~/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "~/ui/toggle-group";
import { type FilterValues } from "./types";

const yearRange = [1975, new Date().getFullYear()];

const ratingRange = [1, 10];

const localizationOptions = [
  { value: "DUB", label: "Озвучення" },
  { value: "SUB", label: "Субтитри" },
];

const typeOptions = [
  { value: "ТБ", label: "ТБ" },
  { value: "Повнометражне", label: "Повнометражне" },
  { value: "ТБ-спешл", label: "ТБ-спешл" },
  { value: "Короткометражне", label: "Короткометражне" },
  { value: "OVA", label: "OVA" },
  { value: "ONA", label: "ONA" },
];

const genreOptions = [
  { value: "70", label: "Антиутопія" },
  { value: "73", label: "Бойове мистецтво" },
  { value: "52", label: "Бойовик" },
  { value: "10", label: "Буденність" },
  { value: "14", label: "Готика" },
  { value: "19", label: "Детектив" },
  { value: "16", label: "Драма" },
  { value: "65", label: "Еротика" },
  { value: "15", label: "Еччі" },
  { value: "4", label: "Жахи" },
  { value: "29", label: "Зомбі" },
  { value: "81", label: "Ісекай" },
  { value: "60", label: "Історія" },
  { value: "62", label: "Казка" },
  { value: "5", label: "Комедія" },
  { value: "61", label: "Кіберпанк" },
  { value: "58", label: "Комодо" },
  { value: "57", label: "Махо-шьоджьо" },
  { value: "9", label: "Меха" },
  { value: "20", label: "Містика" },
  { value: "56", label: "Музичний" },
  { value: "68", label: "Надприродне" },
  { value: "47", label: "Пародія" },
  { value: "3", label: "Пригоди" },
  { value: "69", label: "Психологія" },
  { value: "45", label: "Постапокаліптика" },
  { value: "11", label: "Романтика" },
  { value: "12", label: "Спорт" },
  { value: "55", label: "Шьоджьо-аї" },
  { value: "59", label: "Шьонен-аї" },
  { value: "21", label: "Триллер" },
  { value: "41", label: "Фантастика" },
  { value: "6", label: "Фентезі" },
  { value: "22", label: "Школа" },
  { value: "49", label: "Шьоджьо" },
  { value: "7", label: "Шьонен" },
];

const sortByOptions = [
  { value: "date", label: "Дата додавання" },
  { value: "title", label: "Назва" },
  { value: "year", label: "Рік виходу" },
  { value: "comm_num", label: "Кількість коментарів" },
  { value: "news_read", label: "Кількість переглядів" },
  { value: "rating", label: "Рейтинг" },
];

export const Filters = () => {
  const form = useFormContext<FilterValues>();

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="localization"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <FormLabel>Локалізація</FormLabel>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <ToggleGroup
                    size="sm"
                    type="multiple"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {localizationOptions.map(({ value, label }) => (
                      <ToggleGroupItem key={value} value={value}>
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <FormLabel>Тип</FormLabel>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <ToggleGroup
                    size="sm"
                    type="multiple"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {typeOptions.map(({ value, label }) => (
                      <ToggleGroupItem key={value} value={value}>
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="genre"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <FormLabel>Жанр</FormLabel>
              </CardHeader>
              <CardContent>
                <FormControl>
                  <MultiCombobox
                    options={genreOptions}
                    value={
                      field.value
                        ? field.value.map(
                            (v) => genreOptions.find((o) => o.value === v)!,
                          )
                        : []
                    }
                    onChange={(nextOptions) =>
                      field.onChange(nextOptions.map((o) => o.value))
                    }
                  />
                </FormControl>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <FormLabel>Рік виходу</FormLabel>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  <FormControl>
                    <Input
                      className="h-7 w-14 px-1 text-center"
                      defaultValue={yearRange[0]}
                      value={field.value?.[0]}
                      onChange={(e) =>
                        field.onChange([
                          e.target.value,
                          field.value?.[1] ?? yearRange[1],
                        ])
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <Slider
                      defaultValue={yearRange}
                      value={field.value}
                      onValueChange={field.onChange}
                      minStepsBetweenThumbs={1}
                      min={yearRange[0]}
                      max={yearRange[1]}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      className="h-7 w-14 px-1 text-center"
                      defaultValue={yearRange[1]}
                      value={field.value?.[1]}
                      onChange={(e) =>
                        field.onChange([
                          field.value?.[0] ?? yearRange[0],
                          e.target.value,
                        ])
                      }
                    />
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <FormLabel>Рейтинг</FormLabel>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  <FormControl>
                    <Input
                      className="h-7 w-14 px-1 text-center"
                      defaultValue={ratingRange[0]}
                      value={field.value?.[0]}
                      onChange={(e) =>
                        field.onChange([
                          e.target.value,
                          field.value?.[1] ?? ratingRange[1],
                        ])
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <Slider
                      defaultValue={ratingRange}
                      value={field.value}
                      onValueChange={field.onChange}
                      minStepsBetweenThumbs={1}
                      min={ratingRange[0]}
                      max={ratingRange[1]}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      className="h-7 w-14 px-1 text-center"
                      defaultValue={ratingRange[1]}
                      value={field.value?.[1]}
                      onChange={(e) =>
                        field.onChange([
                          field.value?.[0] ?? ratingRange[0],
                          e.target.value,
                        ])
                      }
                    />
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sortBy"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardHeader>
                <FormLabel>Сортування</FormLabel>
              </CardHeader>
              <CardContent className="flex gap-1.5">
                <FormControl>
                  <Select
                    defaultValue="date"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Виберіть..." />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectContent>
                        <SelectGroup>
                          {sortByOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </FormControl>
                <FormField
                  name="sortDir"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() =>
                            field.onChange(
                              field.value === "asc" ? "desc" : "asc",
                            )
                          }
                        >
                          {field.value === "asc" ? (
                            <IconSortAscending />
                          ) : (
                            <IconSortDescending />
                          )}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </div>
  );
};
