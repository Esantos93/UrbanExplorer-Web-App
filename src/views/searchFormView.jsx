// SearchFormView.jsx
import React from "react";
import "/src/styles/style.css";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

export function SearchFormView(props) {
    function textChangeACB(evt) {
        const newText = evt.target.value;
        //console.log("Search text changed:", newText);
        props.onQueryChange?.(newText);
    }

    function searchClickACB() {
        //console.log("Clicked search button next to input");
        props.onSearchClick?.();
    }

    function searchCurrentLocationACB() {
        props.onRequestCurrentLocation?.();
    }

    function clearCategoriesACB() {
        const categoriesToClear = [...(props.selectedCategories || [])];

        function clearCategoryCB(categoryValue) {
            props.onCategoryToggle?.(categoryValue, false);
        }

        categoriesToClear.forEach(clearCategoryCB);
    }

    function renderCategoryACB(category) {
        const isSelected = props.selectedCategories?.includes(category.value) || false;

        function onCheckedChangeACB(checked) {
            //console.log("Set category " + category.value + " to " + checked);
            props.onCategoryToggle?.(category.value, checked);
        }

        function onSelectACB(e) {
            e.preventDefault();
        }

        return (
            <DropdownMenuCheckboxItem
                key={category.value}
                checked={isSelected}
                onCheckedChange={onCheckedChangeACB}
                onSelect={onSelectACB}
                className={isSelected ? "text-accent-600 hover:text-accent-600!" : ""}
            >
                {category.label}
                <category.icon className="ml-auto h-4 w-4" />
            </DropdownMenuCheckboxItem>
        );
    }

    function renderSearchInput() {
        function handleKeyDownACB(e) {
            if (e.key === "Enter") {
                searchClickACB();
            }
        }

        return (
            <InputGroup className="h-12 bg-white">
                <InputGroupInput
                    placeholder="What will you find today? Search cities or streets"
                    value={props.query || ""}
                    onChange={textChangeACB}
                    onKeyDown={handleKeyDownACB}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        onClick={searchClickACB}
                        variant="default"
                        size="lg"
                    >
                        Search
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        );
    }

    function categorySearchKeyDownCB(e) {
        e.stopPropagation();
    }

    function categorySearchPointerDownCB(e) {
        e.stopPropagation();
    }

    function renderCategoryDropdown() {
        const [categorySearch, setCategorySearch] = React.useState("");

        function filterCategoryCB(category) {
            return category.label.toLowerCase().startsWith(categorySearch.toLowerCase());
        }

        const filteredCategories = props.categoryOptions.filter(filterCategoryCB);

        function categorySearchChangeACB(e) {
            setCategorySearch(e.target.value);
        }

        const hasSelectedCategories = props.selectedCategories.length > 0;
        const buttonText = hasSelectedCategories
            ? `${props.selectedCategories.length} Categor${props.selectedCategories.length === 1 ? "y" : "ies"} selected`
            : "Select Category";

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-50">
                    <Button
                        variant="outline"
                        size="lg"
                        className={
                            hasSelectedCategories
                                ? "border-accent-600 text-accent-600 hover:text-accent-600 hover:bg-accent-100"
                                : ""
                        }
                    >
                        {buttonText}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-50 max-h-64 overflow-y-auto">
                    <div
                        className="p-2"
                        onPointerDown={categorySearchPointerDownCB}
                        onKeyDown={categorySearchKeyDownCB}
                    >
                        <Input
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={categorySearchChangeACB}
                            className="w-full"
                        />
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No categories found
                        </div>
                    )}

                    {filteredCategories.map(renderCategoryACB)}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearCategoriesACB}>
                        Clear all
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    function renderLocationButton() {
        return (
            <Button
                className="ml-auto"
                size="lg"
                variant="outline"
                onClick={searchCurrentLocationACB}
            >
                <MapPin />
                <span className="hidden sm:inline">Current location</span>
            </Button>
        );
    }

    function renderFilterControls() {
        return (
            <div className="flex gap-2">
                {renderCategoryDropdown()}
                {renderLocationButton()}
            </div>
        );
    }

    return (
        <div className="global-px pb-8 pt-16 sm:pt-26 sm:pb-10 flex flex-col gap-16 items-center search-background">
            <h2 className="font-semibold text-center text-3xl sm:text-4xl tracking-tight max-w-2xl">
                Did you know there's{" "}
                <span className="text-accent-600">something interesting</span>{" "}
                right around the corner?
            </h2>

            <div className="grid w-full max-w-2xl gap-2">
                {renderSearchInput()}
                {renderFilterControls()}
            </div>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <p>Log in to add places to your favorites.</p>
                <p>Add them to a route from the favorites page!</p>
            </div>
        </div>
    );
}